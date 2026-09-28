/** @type {import('next').NextConfig} */
const API_ORIGIN = process.env.API_ORIGIN || "http://localhost:4000";

const nextConfig = {
  // Empêche Next.js de mal deviner la racine du monorepo à cause du
  // package-lock.json présent à la fois ici et à la racine du dépôt.
  turbopack: { root: __dirname },
  async rewrites() {
    // Le navigateur ne voit qu'une seule origine (celle de Next.js) : les
    // cookies de session posés par l'API Express fonctionnent donc
    // normalement, sans configuration CORS côté navigateur.
    return [{ source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` }];
  }
};

module.exports = nextConfig;
