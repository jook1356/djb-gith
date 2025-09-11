import type { NextConfig } from "next";
const path = require('path')
const isCI = Boolean(process.env.GITHUB_REPOSITORY);
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? undefined;
const shouldUseBasePath = isCI && Boolean(repository);

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: shouldUseBasePath ? `/${repository}` : undefined,
  assetPrefix: shouldUseBasePath ? `/${repository}/` : undefined,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // 개발 환경에서만 프록시 설정 (CORS 해결)
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/worker/:path*',
          destination: 'http://127.0.0.1:8787/:path*',
        },
      ];
    }
    return [];
  },
  // 헤더 설정
  
};

export default nextConfig;
