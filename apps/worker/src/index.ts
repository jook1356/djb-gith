export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  JWT_SECRET: string;
  ALLOWED_ORIGINS: string; // 쉼표로 구분된 오리진 목록
  AUTH_SESSIONS: KVNamespace;
}

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

// JWT 유틸리티 함수들
async function createJWT(payload: any, secret: string): Promise<string> {
  const header = {
    alg: "HS256",
    typ: "JWT",
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

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  const encodedSignature = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  );

  return `${data}.${encodedSignature}`;
}

async function verifyJWT(token: string, secret: string): Promise<any> {
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
      atob(signature)
        .split("")
        .map((char) => char.charCodeAt(0))
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

// 허용된 오리진인지 확인
function isAllowedOrigin(
  origin: string | null,
  allowedOrigins: string
): boolean {
  if (!origin) return false;

  const origins = allowedOrigins.split(",").map((o) => o.trim());
  return origins.includes(origin);
}

// CORS 헤더 설정
function corsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

// GitHub OAuth 시작
async function handleAuthStart(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const redirectUri =
    url.searchParams.get("redirect_uri") ||
    env.ALLOWED_ORIGINS.split(",")[0].trim();

  const state = crypto.randomUUID();
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${
    env.GITHUB_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    `${url.origin}/auth/callback`
  )}&scope=repo&state=${state}`;
  // const authUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${url.origin}/auth/callback`)}&scope=user:email&state=${state}`;

  // state를 KV에 저장 (5분 후 만료)
  await env.AUTH_SESSIONS.put(`state:${state}`, redirectUri, {
    expirationTtl: 300,
  });

  return Response.redirect(authUrl, 302);
}

// GitHub OAuth 콜백 처리
async function handleAuthCallback(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return new Response("Missing code or state", { status: 400 });
  }

  // state 검증
  const redirectUri = await env.AUTH_SESSIONS.get(`state:${state}`);
  if (!redirectUri) {
    return new Response("Invalid or expired state", { status: 400 });
  }

  // state 삭제
  await env.AUTH_SESSIONS.delete(`state:${state}`);

  try {
    // GitHub에서 액세스 토큰 획득
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      }
    );

    const tokenData: GitHubTokenResponse = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error("Failed to get access token");
    }

    // GitHub 사용자 정보 획득
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
        "User-Agent": "Blog-Auth-Worker",
      },
    });

    const userData: GitHubUser = await userResponse.json();

    // JWT 토큰 생성
    const jwtPayload = {
      sub: userData.id.toString(),
      login: userData.login,
      name: userData.name,
      email: userData.email,
      avatar_url: userData.avatar_url,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24시간
    };

    const jwt = await createJWT(jwtPayload, env.JWT_SECRET);

    // 세션을 KV에 저장 (24시간)
    await env.AUTH_SESSIONS.put(`session:${userData.id}`, jwt, {
      expirationTtl: 24 * 60 * 60,
    });

    // HttpOnly 쿠키로 JWT 설정
    const response = Response.redirect(redirectUri, 302);

    // JWT를 HttpOnly 쿠키로 설정 (24시간)
    const cookieOptions = [
      `auth_token=${jwt}`,
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      `Max-Age=${24 * 60 * 60}`, // 24시간
      "Path=/",
    ];

    // GitHub Pages 도메인 설정
    const redirectUrl = new URL(redirectUri);
    if (redirectUrl.hostname.includes(".github.io")) {
      cookieOptions.push(
        `Domain=.${redirectUrl.hostname.split(".").slice(-2).join(".")}`
      );
    }

    response.headers.set("Set-Cookie", cookieOptions.join("; "));
    return response;
  } catch (error) {
    console.error("Auth callback error:", error);
    return new Response("Authentication failed", { status: 500 });
  }
}

// 쿠키에서 토큰 추출 함수
function getTokenFromCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return value;
    }
  }
  return null;
}

// 사용자 정보 검증
async function handleUserInfo(request: Request, env: Env): Promise<Response> {
  const token = getTokenFromCookie(request);

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);

    // 세션 확인
    const session = await env.AUTH_SESSIONS.get(`session:${payload.sub}`);
    if (!session) {
      return new Response("Session expired", { status: 401 });
    }

    // 요청 오리진 확인
    const requestOrigin = request.headers.get("Origin");
    const allowedOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS)
      ? requestOrigin!
      : env.ALLOWED_ORIGINS.split(",")[0].trim();

    return new Response(
      JSON.stringify({
        id: payload.sub,
        login: payload.login,
        name: payload.name,
        email: payload.email,
        avatar_url: payload.avatar_url,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(allowedOrigin),
        },
      }
    );
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }
}

// 로그아웃 처리
async function handleLogout(request: Request, env: Env): Promise<Response> {
  const token = getTokenFromCookie(request);

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);

    // 세션 삭제
    await env.AUTH_SESSIONS.delete(`session:${payload.sub}`);

    // 요청 오리진 확인
    const requestOrigin = request.headers.get("Origin");
    const allowedOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS)
      ? requestOrigin!
      : env.ALLOWED_ORIGINS.split(",")[0].trim();

    // HttpOnly 쿠키 삭제
    const response = new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(allowedOrigin),
      },
    });

    // 쿠키 삭제 (만료시간을 과거로 설정)
    response.headers.set(
      "Set-Cookie",
      "auth_token=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/"
    );
    return response;
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get("Origin");

    // 허용된 오리진인지 확인
    const allowedOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS)
      ? requestOrigin!
      : env.ALLOWED_ORIGINS.split(",")[0].trim();

    // CORS preflight 처리
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(allowedOrigin),
      });
    }

    // 라우팅
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
  },
};
