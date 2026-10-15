"use client";

import Script from "next/script";

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown };
  }
}

/**
 * VLibras: tradutor de português para Libras do governo federal (vlibras.gov.br), padrão nos sites públicos.
 * O botão fica no canto da tela; o script só carrega depois que a página fica pronta.
 */
export default function VLibras() {
  return (
    <>
      {/* atributos exigidos pelo widget (vw, vw-access-button, vw-plugin-wrapper) */}
      <div {...{ vw: "" }} className="enabled">
        <div {...{ "vw-access-button": "" }} className="active" />
        <div {...{ "vw-plugin-wrapper": "" }}>
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.VLibras) new window.VLibras.Widget("https://vlibras.gov.br/app");
        }}
      />
    </>
  );
}
