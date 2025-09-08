var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-KhXcfN/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/index.ts
async function createJWT(payload, secret) {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return `${data}.${encodedSignature}`;
}
__name(createJWT, "createJWT");
async function verifyJWT(token, secret) {
  try {
    const [header, payload, signature] = token.split(".");
    const data = `${header}.${payload}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const expectedSignature = new Uint8Array(
      atob(signature).split("").map((char) => char.charCodeAt(0))
    );
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      expectedSignature,
      new TextEncoder().encode(data)
    );
    if (!isValid) {
      throw new Error("Invalid signature");
    }
    return JSON.parse(atob(payload));
  } catch (error) {
    throw new Error("Invalid token");
  }
}
__name(verifyJWT, "verifyJWT");
function isAllowedOrigin(origin, allowedOrigins) {
  if (!origin)
    return false;
  const origins = allowedOrigins.split(",").map((o) => o.trim());
  return origins.includes(origin);
}
__name(isAllowedOrigin, "isAllowedOrigin");
function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true"
  };
}
__name(corsHeaders, "corsHeaders");
async function handleAuthStart(request, env) {
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get("redirect_uri") || env.ALLOWED_ORIGINS.split(",")[0].trim();
  const state = crypto.randomUUID();
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${url.origin}/auth/callback`)}&scope=user:email&state=${state}`;
  await env.AUTH_SESSIONS.put(`state:${state}`, redirectUri, { expirationTtl: 300 });
  return Response.redirect(authUrl, 302);
}
__name(handleAuthStart, "handleAuthStart");
async function handleAuthCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    return new Response("Missing code or state", { status: 400 });
  }
  const redirectUri = await env.AUTH_SESSIONS.get(`state:${state}`);
  if (!redirectUri) {
    return new Response("Invalid or expired state", { status: 400 });
  }
  await env.AUTH_SESSIONS.delete(`state:${state}`);
  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code
      })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error("Failed to get access token");
    }
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `token ${tokenData.access_token}`,
        "User-Agent": "Blog-Auth-Worker"
      }
    });
    const userData = await userResponse.json();
    const jwtPayload = {
      sub: userData.id.toString(),
      login: userData.login,
      name: userData.name,
      email: userData.email,
      avatar_url: userData.avatar_url,
      iat: Math.floor(Date.now() / 1e3),
      exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60
      // 24시간
    };
    const jwt = await createJWT(jwtPayload, env.JWT_SECRET);
    await env.AUTH_SESSIONS.put(`session:${userData.id}`, jwt, { expirationTtl: 24 * 60 * 60 });
    const finalRedirectUrl = `${redirectUri}?token=${jwt}`;
    return Response.redirect(finalRedirectUrl, 302);
  } catch (error) {
    console.error("Auth callback error:", error);
    return new Response("Authentication failed", { status: 500 });
  }
}
__name(handleAuthCallback, "handleAuthCallback");
async function handleUserInfo(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const token = authHeader.substring(7);
  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);
    const session = await env.AUTH_SESSIONS.get(`session:${payload.sub}`);
    if (!session) {
      return new Response("Session expired", { status: 401 });
    }
    const requestOrigin = request.headers.get("Origin");
    const allowedOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS) ? requestOrigin : env.ALLOWED_ORIGINS.split(",")[0].trim();
    return new Response(JSON.stringify({
      id: payload.sub,
      login: payload.login,
      name: payload.name,
      email: payload.email,
      avatar_url: payload.avatar_url
    }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(allowedOrigin)
      }
    });
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }
}
__name(handleUserInfo, "handleUserInfo");
async function handleLogout(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const token = authHeader.substring(7);
  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);
    await env.AUTH_SESSIONS.delete(`session:${payload.sub}`);
    const requestOrigin = request.headers.get("Origin");
    const allowedOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS) ? requestOrigin : env.ALLOWED_ORIGINS.split(",")[0].trim();
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(allowedOrigin)
      }
    });
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }
}
__name(handleLogout, "handleLogout");
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get("Origin");
    const allowedOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS) ? requestOrigin : env.ALLOWED_ORIGINS.split(",")[0].trim();
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(allowedOrigin)
      });
    }
    switch (url.pathname) {
      case "/auth/start":
        return handleAuthStart(request, env);
      case "/auth/callback":
        return handleAuthCallback(request, env);
      case "/auth/user":
        return handleUserInfo(request, env);
      case "/auth/logout":
        return handleLogout(request, env);
      default:
        return new Response("Not Found", { status: 404 });
    }
  }
};

// ../../node_modules/.pnpm/wrangler@3.114.14_@cloudflare+workers-types@4.20250906.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../node_modules/.pnpm/wrangler@3.114.14_@cloudflare+workers-types@4.20250906.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-KhXcfN/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../node_modules/.pnpm/wrangler@3.114.14_@cloudflare+workers-types@4.20250906.0/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-KhXcfN/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
