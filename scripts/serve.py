#!/usr/bin/env python3
"""Token-gated static server for the Pixel VFX desktop shell.

The token is written to .token next to the repo root and must be presented
either as ?t=<token> on the first request (which sets a session cookie) or
via that cookie on every later request. Directory listing is disabled: this
server exposes application files only.
"""
import argparse
import http.server
import os
import secrets
import sys
import urllib.parse

COOKIE_NAME = "pvfx"


def load_or_create_token(token_path: str) -> str:
    if os.path.exists(token_path):
        with open(token_path, "r", encoding="ascii") as fh:
            existing = fh.read().strip()
        if existing:
            return existing
    token = secrets.token_urlsafe(16)
    with open(token_path, "w", encoding="ascii", newline="\n") as fh:
        fh.write(token + "\n")
    return token


class TokenHandler(http.server.SimpleHTTPRequestHandler):
    token = ""

    def _cookie_ok(self) -> bool:
        raw = self.headers.get("Cookie", "")
        for part in raw.split(";"):
            k, _, v = part.strip().partition("=")
            if k == COOKIE_NAME and v == self.token:
                return True
        return False

    def _token_ok(self) -> tuple:
        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)
        tok = qs.get("t", [""])[0]
        return tok == self.token and tok != "", tok != ""

    def send_head(self):
        cookie_ok = self._cookie_ok()
        tok_ok, grant_cookie = self._token_ok()
        if not (cookie_ok or tok_ok):
            self.send_error(403, "missing or invalid token (use launch-desktop.cmd)")
            return None
        self._grant = grant_cookie and not cookie_ok
        return super().send_head()

    def list_directory(self, path):
        self.send_error(403, "directory listing disabled")
        return None

    def end_headers(self):
        if getattr(self, "_grant", False):
            self.send_header(
                "Set-Cookie",
                f"{COOKIE_NAME}={self.token}; Path=/; HttpOnly; SameSite=Strict",
            )
            self._grant = False
        super().end_headers()

    def log_message(self, format, *args):
        sys.stderr.write("[serve] %s\n" % (format % args))


def main() -> int:
    ap = argparse.ArgumentParser(description="Pixel VFX token-gated static server")
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument(
        "--dir",
        default=os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        help="repo root to serve (default: parent of scripts/)",
    )
    args = ap.parse_args()

    token_path = os.path.join(args.dir, ".token")
    token = load_or_create_token(token_path)
    TokenHandler.token = token

    handler = lambda *a, **kw: TokenHandler(*a, directory=args.dir, **kw)
    server = http.server.ThreadingHTTPServer((args.host, args.port), handler)
    print(f"[serve] http://{args.host}:{args.port}/?t={token}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
    return 0


if __name__ == "__main__":
    sys.exit(main())
