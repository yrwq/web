/** @type {import('next').NextConfig} */
// import { withBundleAnalyzer } from "@next/bundle-analyzer"
// const withBundleAnalyzer = import('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });

const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  // output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.raindrop.io',
      },
      {
        protocol: 'https',
        hostname: '**.rdl.ink',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
      }
    ]
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  // Configure for MDX
  // webpack: (config) => {
  //   // Add MDX handling
  //   config.module.rules.push({
  //     test: /\.mdx?$/,
  //     use: [
  //       {
  //         loader: '@mdx-js/loader',
  //         options: {
  //           providerImportSource: '@mdx-js/react',
  //         },
  //       },
  //     ],
  //   });

  //   return config;
  // },
};

// export default withBundleAnalyzer(nextConfig);
export default nextConfig;
