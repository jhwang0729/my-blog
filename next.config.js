/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async redirects() {
    return [
      // Redirect common paths to prevent 404s
      {
        source: '/admin',
        destination: '/admin-portal-xyz',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig; 