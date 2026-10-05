import { expect, test } from "bun:test";
import { callTool, handleRpc, TOOLS } from "../scripts/mcp-server.mjs";
import { decodePNG } from "../src/pngenc.js";

const golden = await Bun.file(new URL("./golden.json", import.meta.url)).json();

test("initialize returns server info and tool capability", () => {
	const res = handleRpc({
		jsonrpc: "2.0",
		id: 1,
		method: "initialize",
		params: { protocolVersion: "2025-06-18" },
	});
	expect(res.result.serverInfo.name).toBe("pixel-vfx-mcp");
	expect(res.result.capabilities.tools).toBeTruthy();
});

test("notifications produce no response", () => {
	expect(
		handleRpc({ jsonrpc: "2.0", method: "notifications/initialized" }),
	).toBeNull();
});

test("tools/list exposes the four tools", () => {
	const res = handleRpc({ jsonrpc: "2.0", id: 2, method: "tools/list" });
	const names = res.result.tools.map((t) => t.name);
	expect(names).toEqual([
		"list_presets",
		"render_sheet",
		"render_gif",
		"golden_hashes",
	]);
	expect(TOOLS.length).toBe(4);
});

test("list_presets includes the 3D presets", () => {
	const res = callTool("list_presets", {});
	const presets = JSON.parse(res.content[0].text).presets;
	expect(presets.length).toBe(16);
	expect(presets.filter((p) => p.kind === "3d").length).toBe(6);
});

test("render_sheet returns a decodable, non-blank PNG", () => {
	const res = callTool("render_sheet", {
		effectId: "gem_spin3d",
		seed: "3",
		width: 32,
		height: 32,
	});
	const payload = JSON.parse(res.content[0].text);
	const bytes = Buffer.from(payload.base64, "base64");
	const png = decodePNG(bytes);
	expect(png.width).toBeGreaterThanOrEqual(32);
	expect(png.width % 32).toBe(0);
	let lit = 0;
	for (let i = 3; i < png.rgba.length; i += 4) if (png.rgba[i] > 0) lit++;
	expect(lit).toBeGreaterThan(0);
	expect(payload.name.endsWith("_sheet.png")).toBe(true);
});

test("render_gif returns a GIF89a container", () => {
	const res = callTool("render_gif", {
		effectId: "warp_tunnel3d",
		width: 32,
		height: 32,
	});
	const payload = JSON.parse(res.content[0].text);
	const bytes = Buffer.from(payload.base64, "base64");
	expect(new TextDecoder().decode(bytes.subarray(0, 6))).toBe("GIF89a");
});

test("golden_hashes matches the committed golden fixture", () => {
	const res = callTool("golden_hashes", {});
	const hashes = JSON.parse(res.content[0].text);
	expect(hashes.frame0).toBe(golden.frame0);
	expect(hashes.allFrames).toBe(golden.allFrames);
	expect(hashes.sheet).toBe(golden.sheet);
	expect(hashes.gif).toBe(golden.gif);
	expect(hashes.frameCount).toBe(golden.frameCount);
});

test("unknown method and unknown tool return JSON-RPC errors", () => {
	const m = handleRpc({ jsonrpc: "2.0", id: 9, method: "does/not/exist" });
	expect(m.error.code).toBe(-32601);
	const t = handleRpc({
		jsonrpc: "2.0",
		id: 10,
		method: "tools/call",
		params: { name: "nope", arguments: {} },
	});
	expect(t.error.code).toBe(-32000);
	expect(t.error.message).toContain("unknown tool");
});
