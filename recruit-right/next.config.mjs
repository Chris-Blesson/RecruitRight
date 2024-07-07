// Ref: https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["knex"],
  },
};

export default nextConfig;
