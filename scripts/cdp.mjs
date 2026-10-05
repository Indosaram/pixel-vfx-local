export function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

export class Cdp {
	constructor(ws) {
		this.ws = ws;
		this.id = 0;
		this.pending = new Map();
		this.listeners = new Map();
		ws.addEventListener("message", (ev) => {
			const msg = JSON.parse(ev.data);
			if (msg.id !== undefined && this.pending.has(msg.id)) {
				const { resolve, reject } = this.pending.get(msg.id);
				this.pending.delete(msg.id);
				if (msg.error) reject(new Error(msg.error.message));
				else resolve(msg.result);
			} else if (msg.method) {
				const cbs = this.listeners.get(msg.method);
				if (cbs) for (const cb of cbs) cb(msg.params);
			}
		});
	}

	on(method, cb) {
		if (!this.listeners.has(method)) this.listeners.set(method, []);
		this.listeners.get(method).push(cb);
	}

	send(method, params = {}) {
		const id = ++this.id;
		return new Promise((resolve, reject) => {
			this.pending.set(id, { resolve, reject });
			this.ws.send(JSON.stringify({ id, method, params }));
			setTimeout(() => {
				if (this.pending.has(id)) {
					this.pending.delete(id);
					reject(new Error(`CDP timeout: ${method}`));
				}
			}, 30000);
		});
	}

	close() {
		try {
			this.ws.close();
		} catch {
			/* already closed */
		}
	}
}

export async function connectCdp(wsUrl) {
	const ws = new WebSocket(wsUrl);
	await new Promise((resolve, reject) => {
		const t = setTimeout(() => reject(new Error("ws connect timeout")), 10000);
		ws.addEventListener("open", () => {
			clearTimeout(t);
			resolve();
		});
		ws.addEventListener("error", (e) => {
			clearTimeout(t);
			reject(new Error(`ws error ${e.message}`));
		});
	});
	return new Cdp(ws);
}

export async function waitFor(fn, timeoutMs, label) {
	const start = Date.now();
	for (;;) {
		let v;
		try {
			v = await fn();
		} catch {
			v = false;
		}
		if (v) return v;
		if (Date.now() - start > timeoutMs)
			throw new Error(`timeout waiting for ${label}`);
		await sleep(150);
	}
}
