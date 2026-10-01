"use client";

import { useRef } from "react";
import { aoEntrar, COM_MOVIMENTO, gsap, useGSAP } from "@/lib/gsap";
import BrandMark from "./BrandMark";
import styles from "./Footer.module.css";

/*
 * Rodapé em cor sólida (azul profundo), sem imagens. A animação é toda GSAP e roda uma vez ao chegar nele:
 * a linha do topo corre, as três casas do símbolo se montam, cada coluna ganha seu traço e os links entram em sequência.
 * Links só ganham opacidade — nunca visibility:hidden nem deslocamento — para continuarem clicáveis no lugar certo
 * durante a entrada.
 */
export default function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;
      const q = gsap.utils.selector(raiz);
      const mm = gsap.matchMedia();
      mm.add(COM_MOVIMENTO, () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        aoEntrar(raiz, tl, "top 92%");
        tl.fromTo(q("[data-linha-topo]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" })
          // símbolo: telhados descem e arcos sobem, uma casa depois da outra
          .from(q('[data-marca] [data-parte="telhado"]'), { yPercent: -45, opacity: 0, duration: 0.7, stagger: 0.12 }, 0.2)
          .from(q('[data-marca] [data-parte="arco"]'), { yPercent: 30, opacity: 0, duration: 0.7, stagger: 0.12 }, 0.2)
          .from(q("[data-nome]"), { x: -10, opacity: 0, filter: "blur(4px)", duration: 0.7 }, 0.5)
          .from(q("[data-sobre]"), { y: 10, opacity: 0, duration: 0.6 }, 0.6)
          // colunas: título entra, o traço embaixo se desenha e os itens descem em cascata
          .from(q("h3"), { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.45)
          .fromTo(q("[data-traco]"), { scaleX: 0 }, { scaleX: 1, duration: 0.6, stagger: 0.08, ease: "power2.inOut" }, 0.6)
          // itens com link só aparecem (sem se deslocar): se andassem, um clique no meio da entrada cairia no vão
          .from(q("li"), { opacity: 0, duration: 0.45, stagger: 0.03 }, 0.7)
          // linha de baixo abre do centro
          .fromTo(q("[data-linha-base]"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut" }, 0.9)
          .from(q("[data-base] > *"), { opacity: 0, duration: 0.5, stagger: 0.08 }, 1.1);

        // a seta do "voltar ao topo" balança de leve, sem parar
        gsap.to(q("[data-seta-topo]"), { y: -3, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  /** Passar o mouse no símbolo remonta as casas. */
  const remontar = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raiz = ref.current;
    if (!raiz) return;
    gsap.fromTo(raiz.querySelectorAll('[data-marca] [data-parte="telhado"]'), { yPercent: -45, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", overwrite: true });
    gsap.fromTo(raiz.querySelectorAll('[data-marca] [data-parte="arco"]'), { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", overwrite: true });
  };

  const coluna = (titulo: string, itens: React.ReactNode[]) => (
    <div>
      <h3>{titulo}</h3>
      <span className={styles.traco} data-traco aria-hidden="true" />
      <ul>
        {itens.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className={styles.footer} ref={ref}>
      <span className={styles.linhaTopo} data-linha-topo aria-hidden="true" />
      <div className={styles.fIn}>
        <div>
          <a className={styles.marca} href="#top" data-marca onMouseEnter={remontar} onFocus={remontar}>
            <BrandMark size={30} />
            <span data-nome>SISConforme</span>
          </a>
          <p className={styles.sobre} data-sobre>
            Portal de autorregularização do ISSQN · Secretaria Municipal de Economia de Porto Velho
          </p>
        </div>
        {coluna("Portal", [
          <a key="i" href="#introducao">Introdução</a>,
          <a key="c" href="#cruzamento">Cruzamento</a>,
          <a key="a" href="#comunicacao">Alertas</a>,
          <a key="d" href="#disponibilidade">Disponibilidade</a>,
        ])}
        {coluna("Fontes", ["NFS-e municipal", "PGDAS-D", "Cartão Cidade · SEFIN-RO"])}
        {coluna("Legislação", ["CTN, arts. 138 e 198", "LC nº 116/2003", "LC nº 123/2006", "Lei nº 13.709/2018"])}
        {coluna("Ajuda", [
          <a key="p" href="#seguranca">Privacidade</a>,
          <a key="s" href="#seguranca">Segurança</a>,
          <a key="t" href="#disponibilidade">Atendimento</a>,
        ])}
      </div>
      <div className={styles.fBot}>
        <span className={styles.linhaBase} data-linha-base aria-hidden="true" />
        <div className={styles.baseIn} data-base>
          <span>© 2026 Prefeitura de Porto Velho · SEMEC</span>
          <span>Protótipo de interface</span>
          <a className={styles.topo} href="#top">
            Voltar ao topo
            <span data-seta-topo aria-hidden="true">
              ↑
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
