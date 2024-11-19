/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  default-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://example.com;
  style-src 'self' 'unsafe-inline' https://example.com;
  img-src 'self' https://wordpress.local.example.com blob: data:;
  media-src 'none';
  connect-src 'self' https://wordpress.local.example.com;
  font-src 'self';
`;

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wordpress.local.example.com',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ];
  }
};

export default nextConfig;
