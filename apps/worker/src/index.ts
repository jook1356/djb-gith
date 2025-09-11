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
    alg: 'HS256',
    typ: 'JWT'
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${data}.${encodedSignature}`;
}

async function verifyJWT(token: string, secret: string): Promise<any> {
  try {
    const [header, payload, signature] = token.split('.');
    
    const data = `${header}.${payload}`;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const expectedSignature = new Uint8Array(
      atob(signature).split('').map(char => char.charCodeAt(0))
    );
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      expectedSignature,
      new TextEncoder().encode(data)
    );
    
    if (!isValid) {
      throw new Error('Invalid signature');
    }
    
    return JSON.parse(atob(payload));
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// 허용된 오리진인지 확인
function isAllowedOrigin(origin: string | null, allowedOrigins: string): boolean {
  if (!origin) return false;
  
  const origins = allowedOrigins.split(',').map(o => o.trim());
  return origins.includes(origin);
}

// CORS 헤더 설정
function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// 쿠키 파싱 유틸리티
function getCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;
  const cookies = cookie.split(';').map(c => c.trim());
  for (const part of cookies) {
    const [k, ...rest] = part.split('=');
    if (k === name) {
      return rest.join('=');
    }
  }
  return null;
}

// GitHub OAuth 시작
async function handleAuthStart(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const redirectUri = url.searchParams.get('redirect_uri') || env.ALLOWED_ORIGINS.split(',')[0].trim();

  // 클라이언트 오리진(브라우저) 추출
  const requestOrigin = request.headers.get('Origin');
  const clientOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS)
    ? requestOrigin!
    : env.ALLOWED_ORIGINS.split(',')[0].trim();

  // GitHub Pages(정적)인지 여부에 따라 콜백 베이스 결정
  // - 정적 배포(github.io): 워커 도메인으로 콜백 (쿠키는 워커 도메인에 설정)
  // - 개발/로컬: 프록시 경유 콜백(/api/worker), 브라우저는 localhost 도메인으로 쿠키 수신
  const isGithubPages = /github\.io$/.test(new URL(clientOrigin).hostname);
  const callbackBase = isGithubPages ? url.origin : `${clientOrigin}/api/worker`;

  const state = crypto.randomUUID();
  const githubRedirectUri = `${callbackBase}/auth/callback`;
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(githubRedirectUri)}&scope=repo&state=${state}`;

  // state를 KV에 저장 (5분 후 만료)
  await env.AUTH_SESSIONS.put(`state:${state}`, redirectUri, { expirationTtl: 300 });
  
  return Response.redirect(authUrl, 302);
}

// GitHub OAuth 콜백 처리
async function handleAuthCallback(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  
  if (!code || !state) {
    return new Response('Missing code or state', { status: 400 });
  }
  
  // state 검증
  const redirectUri = await env.AUTH_SESSIONS.get(`state:${state}`);
  if (!redirectUri) {
    return new Response('Invalid or expired state', { status: 400 });
  }
  
  // state 삭제
  await env.AUTH_SESSIONS.delete(`state:${state}`);
  
  try {
    // GitHub에서 액세스 토큰 획득
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });
    
    const tokenData: GitHubTokenResponse = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }
    
    // GitHub 사용자 정보 획득
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${tokenData.access_token}`,
        'User-Agent': 'Blog-Auth-Worker',
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
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24시간
    };
    
    const jwt = await createJWT(jwtPayload, env.JWT_SECRET);
    
    // 세션을 KV에 저장 (24시간)
    await env.AUTH_SESSIONS.put(`session:${userData.id}`, jwt, { expirationTtl: 24 * 60 * 60 });
    
    // httpOnly 쿠키로 토큰 설정 후 프론트엔드로 리다이렉트
    const finalRedirectUrl = `${redirectUri}`;

    let sameSite = 'SameSite=None';
    let secureAttr = 'Secure';

    const cookie = [
      `AUTH_TOKEN=${jwt}`,
      'Path=/',
      'HttpOnly',
      sameSite,
      'Max-Age=86400',
      secureAttr,
    ].filter(Boolean).join('; ');

    return new Response(null, {
      status: 302,
      headers: {
        'Location': finalRedirectUrl,
        'Set-Cookie': cookie,
      },
    });
    
  } catch (error) {
    console.error('Auth callback error:', error);
    return new Response('Authentication failed', { status: 500 });
  }
}

// 사용자 정보 검증
async function handleUserInfo(request: Request, env: Env): Promise<Response> {
  // 우선 쿠키에서 토큰 추출, 없으면 Authorization 헤더 사용(호환)
  const cookieToken = getCookie(request, 'AUTH_TOKEN');
  const authHeader = request.headers.get('Authorization');
  const token = cookieToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);
    
    // 세션 확인
    const session = await env.AUTH_SESSIONS.get(`session:${payload.sub}`);
    if (!session) {
      return new Response('Session expired', { status: 401 });
    }
    
    // 요청 오리진 확인
    const requestOrigin = request.headers.get('Origin');
    const allowedOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS) 
      ? requestOrigin! 
      : env.ALLOWED_ORIGINS.split(',')[0].trim();

    return new Response(JSON.stringify({
      id: payload.sub,
      login: payload.login,
      name: payload.name,
      email: payload.email,
      avatar_url: payload.avatar_url,
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(allowedOrigin),
      },
    });
    
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}

// 로그아웃 처리
async function handleLogout(request: Request, env: Env): Promise<Response> {
  const cookieToken = getCookie(request, 'AUTH_TOKEN');
  const authHeader = request.headers.get('Authorization');
  const token = cookieToken || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const payload = await verifyJWT(token, env.JWT_SECRET);
    
    // 세션 삭제
    await env.AUTH_SESSIONS.delete(`session:${payload.sub}`);
    
    // 요청 오리진 확인
    const requestOrigin = request.headers.get('Origin');
    const allowedOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS) 
      ? requestOrigin! 
      : env.ALLOWED_ORIGINS.split(',')[0].trim();

    // 쿠키 제거: 로컬은 Lax, 배포는 None; Secure로 맞춰서 삭제
    const origin = request.headers.get('Origin') || '';
    let sameSite = 'SameSite=Lax';
    let secureAttr = '';
    try {
      const o = new URL(origin);
      const isLocal = o.hostname === 'localhost' || o.hostname === '127.0.0.1';
      if (!isLocal) {
        sameSite = 'SameSite=None';
        secureAttr = 'Secure';
      }
    } catch {}

    const deleteCookie = [
      'AUTH_TOKEN=;',
      'Path=/',
      'HttpOnly',
      sameSite,
      'Max-Age=0',
      secureAttr,
    ].filter(Boolean).join('; ');

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders(allowedOrigin),
        'Set-Cookie': deleteCookie,
      },
    });
    
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get('Origin');
    
    // 허용된 오리진인지 확인
    const allowedOrigin = isAllowedOrigin(requestOrigin, env.ALLOWED_ORIGINS) 
      ? requestOrigin! 
      : env.ALLOWED_ORIGINS.split(',')[0].trim();
    
    // CORS preflight 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(allowedOrigin),
      });
    }
    
    // 라우팅 (끝 슬래시 제거)
    const pathname = url.pathname.replace(/\/$/, '');
    switch (pathname) {
      case '/auth/start':
        return handleAuthStart(request, env);
        
      case '/auth/callback':
        return handleAuthCallback(request, env);
        
      case '/auth/user':
        return handleUserInfo(request, env);
        
      case '/auth/logout':
        return handleLogout(request, env);
        
      default:
        return new Response('Not Found', { status: 404 });
    }
  },
};
