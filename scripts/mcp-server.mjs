#!/usr/bin/env bun
// MCP stdio server (JSON-RPC 2.0, one message per line). Exports handleRpc for tests.
import { createInterface } from "node:readline";
import { ALL_PRESETS } from "../src/effects.js";
import {
	bytesToBase64,
	DEFAULTS,
	exportGif,
	exportSheet,
	goldenHashes,
} from "../src/pipeline.js";

const SERVER_INFO = { name: "pixel-vfx-mcp", version: "1.0.0" };

const PRESET_SCHEMA_PROPS = {
	effectId: { type: "string" },
	seed: { type: "string" },
	width: { type: "integer", minimum: 8, maximum: 512 },
	height: { type: "integer", minimum: 8, maximum: 512 },
	fps: { type: "integer", minimum: 1, maximum: 60 },
	pixelScale: { type: "integer", minimum: 1, maximum: 8 },
	paletteSize: { type: "integer", minimum: 2, maximum: 256 },
	camera3d: {
		type: "object",
		properties: {
			yaw: { type: "number" },
			pitch: { type: "number" },
			dist: { type: "number" },
			fov: { type: "number" },
		},
	},
};

export const TOOLS = [
	{
		name: "list_presets",
		description:
			"List the original presets with kind (2d/3d), loop flag and duration.",
		inputSchema: {
			type: "object",
			properties: {},
			additionalProperties: false,
		},
	},
	{
		name: "render_sheet",
		description:
			"Render a preset to a PNG sprite sheet and return base64 plus export metadata.",
		inputSchema: {
			type: "object",
			properties: PRESET_SCHEMA_PROPS,
			additionalProperties: false,
		},
	},
	{
		name: "render_gif",
		description:
			"Render a preset to an animated GIF and return base64 plus export metadata.",
		inputSchema: {
			type: "object",
			properties: PRESET_SCHEMA_PROPS,
			additionalProperties: false,
		},
	},
	{
		name: "golden_hashes",
		description:
			"Compute the deterministic golden hashes for the built-in fixture.",
		inputSchema: {
			type: "object",
			properties: {},
			additionalProperties: false,
		},
	},
];

function textResult(obj) {
	return { content: [{ type: "text", text: JSON.stringify(obj) }] };
}

function renderParams(args) {
	return {
		...DEFAULTS,
		...args,
		camera3d: { ...DEFAULTS.camera3d, ...(args.camera3d || {}) },
	};
}

export function callTool(name, args = {}) {
	if (name === "list_presets") {
		return textResult({
			presets: ALL_PRESETS.map((p) => ({
				id: p.id,
				name: p.name,
				kind: p.kind,
				loop: p.loop,
				duration: p.duration,
			})),
		});
	}
	if (name === "render_sheet" || name === "render_gif") {
		const p = renderParams(args);
		const r = name === "render_sheet" ? exportSheet(p) : exportGif(p);
		return textResult({
			name: r.name,
			kind: r.kind,
			width: r.width,
			height: r.height,
			cellCount: r.cellCount,
			totalMs: r.totalMs ?? null,
			totalSeconds: r.totalSeconds ?? null,
			base64: bytesToBase64(r.bytes),
		});
	}
	if (name === "golden_hashes") return textResult(goldenHashes());
	throw new Error(`unknown tool: ${name}`);
}

function reply(id, result) {
	return { jsonrpc: "2.0", id, result };
}

export function handleRpc(msg) {
	if (!msg || typeof msg !== "object" || typeof msg.method !== "string")
		return null;
	const { id, method, params } = msg;
	const isNotification = id === undefined || id === null;
	try {
		if (method === "initialize") {
			return reply(id, {
				protocolVersion: params?.protocolVersion || "2024-11-05",
				capabilities: { tools: {} },
				serverInfo: SERVER_INFO,
			});
		}
		if (method.startsWith("notifications/")) return null;
		if (method === "ping") return reply(id, {});
		if (method === "tools/list") return reply(id, { tools: TOOLS });
		if (method === "tools/call")
			return reply(id, callTool(params?.name, params?.arguments || {}));
		if (isNotification) return null;
		return {
			jsonrpc: "2.0",
			id,
			error: { code: -32601, message: `unknown method ${method}` },
		};
	} catch (err) {
		if (isNotification) return null;
		return {
			jsonrpc: "2.0",
			id,
			error: {
				code: -32000,
				message: String(err?.message || err),
			},
		};
	}
}

if (import.meta.main) {
	const rl = createInterface({ input: process.stdin });
	rl.on("line", (line) => {
		const trimmed = line.trim();
		if (!trimmed) return;
		let msg = null;
		try {
			msg = JSON.parse(trimmed);
		} catch {
			process.stdout.write(
				`${JSON.stringify({
					jsonrpc: "2.0",
					id: null,
					error: { code: -32700, message: "parse error" },
				})}\n`,
			);
			return;
		}
		const res = handleRpc(msg);
		if (res) process.stdout.write(`${JSON.stringify(res)}\n`);
	});
	rl.on("close", () => process.exit(0));
}
