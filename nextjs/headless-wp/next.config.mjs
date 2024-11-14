/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  default-src 'none';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://probarra.xyz;
  style-src 'self' 'unsafe-inline' https://probarra.xyz;
  img-src 'self' https://wordpress.local.probarra.xyz blob: data:;
  media-src 'none';
  connect-src 'self' https://wordpress.local.probarra.xyz;
  font-src 'self';
`;

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wordpress.local.probarra.xyz',
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
