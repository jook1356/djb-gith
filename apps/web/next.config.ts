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
};

export default nextConfig;
