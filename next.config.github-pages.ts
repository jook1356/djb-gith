import type { NextConfig } from "next";

// GitHub Pages용 설정 (OAuth 없이 정적 사이트만)
const isCI = Boolean(process.env.GITHUB_REPOSITORY);
const repository = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? undefined;
const shouldUseBasePath = isCI && Boolean(repository);

const nextConfig: NextConfig = {
  output: "export", // 정적 내보내기
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: shouldUseBasePath ? `/${repository}` : undefined,
  assetPrefix: shouldUseBasePath ? `/${repository}/` : undefined,
};

export default nextConfig;
