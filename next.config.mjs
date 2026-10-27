/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Le build Vercel ne doit pas échouer pour un simple avertissement de style.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
