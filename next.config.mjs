/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  env: {
    NEXT_PUBLIC_DOMAIN: "http://localhost:3000",
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY:
      "pk_test_51QgS4eR48rGX56bzBZaaua833WZtTJkl6NId6P5ozmRXjCh9sesxiSkCGsUFu9EM8YLjTrO41LveZ2JYj1QN13uz00MB9yr0Sc",
  },
  images: {
    remotePatterns: [
      { hostname: "imgcld.yatra.com", protocol: "https" },
      { hostname: "content.r9cdn.net", protocol: "https" },
    ],
  },
};

export default nextConfig;
