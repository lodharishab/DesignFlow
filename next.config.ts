
import type {NextConfig} from 'next';

const replitDomain = process.env.REPLIT_DEV_DOMAIN;
const devOrigins: string[] = [];
if (replitDomain) {
  devOrigins.push(`https://${replitDomain}`);
}
devOrigins.push("http://localhost:5000", "http://127.0.0.1:5000", "http://0.0.0.0:5000");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  allowedDevOrigins: devOrigins,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
