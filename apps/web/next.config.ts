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

  // 아래부터는 MDXEditor를 사용하기 위한 설정
  transpilePackages: ['@mdxeditor/editor'],
  reactStrictMode: true,
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, topLevelAwait: true }
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config
  }
};

export default nextConfig;
