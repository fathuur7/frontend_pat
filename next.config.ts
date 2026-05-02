import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options",    value: "nosniff" },
  // Referrer policy
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  // Permissions policy – disable unused powerful features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS (enable once behind TLS)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Basic XSS protection for older browsers
  { key: "X-XSS-Protection",          value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  // Remove the "X-Powered-By: Next.js" response header
  poweredByHeader: false,

  // Compress responses with gzip
  compress: true,

  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.wikipedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.56.12",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.56.10",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "192.168.56.11",
        port: "4000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    // Serve modern formats automatically
    formats: ["image/avif", "image/webp"],
  },

  // Apply security headers to every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
