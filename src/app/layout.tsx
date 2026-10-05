import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { caminho } from "@/lib/caminho";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "SISConforme",
  description: "Portal de autorregularização do ISSQN de Porto Velho.",
  openGraph: { title: "SISConforme", images: [caminho("/img/og-image.jpg")] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      {/* Extensões do navegador (ex.: ColorZilla) injetam atributos no <body> antes da hidratação */}
      <body suppressHydrationWarning>
        {children}
        {/* só para quem está sem JavaScript; fica no fim para não brigar com a barra fixa do topo */}
        <noscript>
          <div className="aviso-sem-js" role="note">
            <p>As animações deste site precisam de JavaScript, mas todo o conteúdo está disponível nesta página.</p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
