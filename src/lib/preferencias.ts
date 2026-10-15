"use client";

import { useSyncExternalStore } from "react";

/**
 * Preferências de acessibilidade escolhidas na barra do topo. Cada uma é uma classe no <html> (o CSS faz o resto)
 * e fica guardada no navegador de quem escolheu. O script em layout.tsx reaplica as classes antes da página
 * aparecer, para não piscar o visual padrão.
 */
export type Preferencia = "contraste" | "pausado";

const CHAVE: Record<Preferencia, string> = { contraste: "a11y-contraste", pausado: "a11y-pausado" };

/** Roda no <head>, antes da hidratação. Mantém em sincronia com CHAVE. */
export const SCRIPT_PREFERENCIAS = `try{var d=document.documentElement,s=localStorage;if(s.getItem("${CHAVE.contraste}")==="1")d.classList.add("contraste");if(s.getItem("${CHAVE.pausado}")==="1")d.classList.add("pausado")}catch(e){}`;

const ouvintes = new Set<(p: Preferencia, ligada: boolean) => void>();

/** Avisado quando uma preferência muda (ex.: para parar os laços do GSAP). */
export function aoMudarPreferencia(fn: (p: Preferencia, ligada: boolean) => void): () => void {
  ouvintes.add(fn);
  return () => ouvintes.delete(fn);
}

export const preferenciaLigada = (p: Preferencia): boolean =>
  typeof document !== "undefined" && document.documentElement.classList.contains(p);

export function definirPreferencia(p: Preferencia, ligada: boolean) {
  document.documentElement.classList.toggle(p, ligada);
  try {
    if (ligada) localStorage.setItem(CHAVE[p], "1");
    else localStorage.removeItem(CHAVE[p]);
  } catch {
    // navegação privada ou armazenamento bloqueado: vale só até recarregar
  }
  ouvintes.forEach((fn) => fn(p, ligada));
}

function assinar(avisar: () => void) {
  const obs = new MutationObserver(avisar);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => obs.disconnect();
}

/** Estado de uma preferência para a interface (no servidor e na hidratação vale "desligada"). */
export function usePreferencia(p: Preferencia): boolean {
  return useSyncExternalStore(assinar, () => preferenciaLigada(p), () => false);
}
