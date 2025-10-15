/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 Configuración para Docker y producción
  output: "export",

  // 📝 Configuración de rutas
  trailingSlash: true,
  skipTrailingSlashRedirect: true,

  // 🖼️ Optimización de imágenes
  images: {
    unoptimized: true,
    domains: ["firebasestorage.googleapis.com", "conductores-9oct.appspot.com"],
  },

  // 🔧 Configuración experimental
  experimental: {
    // Mejora el rendimiento en producción
    optimizeCss: true,
  },

  // 📦 Paquetes externos del servidor (movido desde experimental)
  serverExternalPackages: ["firebase-admin"],

  // 🌍 Variables de entorno públicas
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 📦 Configuración de webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimizaciones adicionales para producción
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = "all";
    }

    return config;
  },

  // 🔄 Redirects y rewrites para mejor SEO
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // 🛡️ Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
