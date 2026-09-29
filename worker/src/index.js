const encoder = new TextEncoder();

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extra
    }
  });
}

function cors(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "https://barilia1998.github.io")
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);

  const allowOrigin = allowed.includes(origin) ? origin : allowed[0] || "*";

  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
    "access-control-max-age": "86400",
    "vary": "Origin"
  };
}

function safeEqual(a, b) {
  const aa = encoder.encode(String(a || ""));
  const bb = encoder.encode(String(b || ""));
  if (aa.length !== bb.length) return false;
  let out = 0;
  for (let i = 0; i < aa.length; i++) out |= aa[i] ^ bb[i];
  return out === 0;
}

function base64Url(bytes) {
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function sign(payload, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const body = base64Url(encoder.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(body)));
  return body + "." + base64Url(sig);
}

async function verify(token, secret) {
  if (!token || !token.includes(".")) return false;
  const [body, signature] = token.split(".");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const normalized = signature.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const sigBytes = Uint8Array.from(atob(padded), c => c.charCodeAt(0));
  const ok = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(body));
  if (!ok) return false;

  try {
    const normalizedBody = body.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBody = normalizedBody + "=".repeat((4 - normalizedBody.length % 4) % 4);
    const payload = JSON.parse(atob(paddedBody));
    return Number(payload.exp || 0) > Date.now();
  } catch {
    return false;
  }
}

async function requireAuth(request, env) {
  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return verify(token, env.SESSION_SECRET);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = cors(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/api/health") {
      return json({ ok: true, service: "portfolio-cms" }, 200, corsHeaders);
    }

    if (url.pathname === "/api/content" && request.method === "GET") {
      const content = await env.PORTFOLIO_CONTENT.get("site", "json");
      return json({ ok: true, content: content || null }, 200, {
        ...corsHeaders,
        "cache-control": "public, max-age=30"
      });
    }

    if (url.pathname === "/api/login" && request.method === "POST") {
      let body = {};
      try { body = await request.json(); } catch {}
      if (!safeEqual(body.password, env.ADMIN_PASSWORD)) {
        return json({ ok: false, error: "Invalid password" }, 401, corsHeaders);
      }

      const token = await sign({
        role: "admin",
        exp: Date.now() + 8 * 60 * 60 * 1000
      }, env.SESSION_SECRET);

      return json({ ok: true, token }, 200, corsHeaders);
    }

    if (url.pathname === "/api/content" && request.method === "PUT") {
      if (!(await requireAuth(request, env))) {
        return json({ ok: false, error: "Unauthorized" }, 401, corsHeaders);
      }

      let body;
      try { body = await request.json(); }
      catch { return json({ ok: false, error: "Invalid JSON" }, 400, corsHeaders); }

      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return json({ ok: false, error: "Invalid content" }, 400, corsHeaders);
      }

      await env.PORTFOLIO_CONTENT.put("site", JSON.stringify(body));
      return json({ ok: true, savedAt: new Date().toISOString() }, 200, corsHeaders);
    }

    return json({ ok: false, error: "Not found" }, 404, corsHeaders);
  }
};
