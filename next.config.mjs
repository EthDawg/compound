/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/app/:path*", destination: "/companies/rippling/app/:path*", permanent: true },
      { source: "/backstage/:path*", destination: "/companies/rippling/backstage/:path*", permanent: true },
      { source: "/instance/rippling", destination: "/companies/rippling/app", permanent: true },
      { source: "/instance/workday", destination: "/companies/workday/app", permanent: true },
    ];
  },
};
export default nextConfig;
