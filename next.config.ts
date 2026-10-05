import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  // no GitHub Pages o site fica em /sisconforme-site/ (definido no workflow de deploy); local fica vazio
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  // `next dev` só libera localhost: sem isto, abrir pelo IP da rede bloqueia o JS e nada anima
  allowedDevOrigins: ["192.168.112.1", "192.168.0.126", "10.102.2.21", "10.102.3.8"],
};

export default nextConfig;
