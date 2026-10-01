"use client";

import { useRef } from "react";
import { aoEntrar, gsap, SplitText, useGSAP } from "@/lib/gsap";
import styles from "./Disponibilidade.module.css";

const FALE_CONOSCO = "https://semecdigital.portovelho.ro.gov.br/fale-conosco";

export default function Disponibilidade() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;
      const q = gsap.utils.selector(raiz);
      const mm = gsap.matchMedia();

      mm.add(
        {
          desk: "(min-width: 821px) and (prefers-reduced-motion: no-preference)",
          cel: "(max-width: 820px) and (prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { desk } = ctx.conditions as { desk: boolean; cel: boolean };

          /* ---------- 1. cabeçalho: selo, título letra a letra, parágrafo linha a linha ---------- */
          const titulo = SplitText.create(q("[data-titulo]"), { type: "chars", mask: "chars" });
          const lead = SplitText.create(q("[data-lead]"), { type: "lines", mask: "lines" });
          const cabecalho = gsap.timeline({
            onComplete: () => {
              titulo.revert();
              lead.revert();
            },
          });
          aoEntrar(q("[data-topo]")[0], cabecalho, "top 82%");
          cabecalho
            .from(q("[data-selo]"), { autoAlpha: 0, y: 12, scale: 0.7, duration: 0.6, ease: "back.out(2.4)" })
            .from(titulo.chars, { yPercent: 115, duration: 0.8, ease: "power4.out", stagger: 0.028 }, "-=0.3")
            .from(lead.lines, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.09 }, "-=0.55");

          /* ---------- 2. quadro de ajuda: entra, reflexo atravessa, "?" gira e flutua ---------- */
          const ajuda = gsap.timeline();
          aoEntrar(q("[data-ajuda]")[0], ajuda, "top 86%");
          ajuda
            .from(q("[data-ajuda]"), { autoAlpha: 0, y: 30, duration: 0.7, ease: "power3.out" })
            .from(q("[data-interroga]"), { scale: 0, rotate: -120, duration: 1.1, ease: "elastic.out(1, 0.5)" }, "-=0.35")
            .from(q("[data-ajuda-txt]"), { autoAlpha: 0, x: -14, duration: 0.5, stagger: 0.1 }, "<0.15")
            .from(q("[data-botao]"), { autoAlpha: 0, x: 18, duration: 0.5, ease: "back.out(2)" }, "<0.2")
            .fromTo(q("[data-reflexo]"), { xPercent: 0 }, { xPercent: 360, duration: 1.3, ease: "power2.inOut" }, "<");

          gsap.to(q("[data-interroga]"), { y: -4, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.5 });
          gsap.to(q("[data-interroga]"), {
            keyframes: { rotate: [0, -12, 10, -6, 0] },
            duration: 0.9,
            ease: "sine.inOut",
            repeat: -1,
            repeatDelay: 5,
            delay: 3,
          });

          /* depois da entrada, o quadro continua chamando atenção: o reflexo volta a atravessar,
             um anel sai do botão e a seta dá um empurrãozinho — em ciclo, só com o quadro na tela */
          const chamado = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 3.2 });
          chamado
            .fromTo(q("[data-reflexo]"), { xPercent: 0 }, { xPercent: 360, duration: 1.4, ease: "power2.inOut", immediateRender: false })
            .fromTo(q("[data-botao-anel]"), { scaleX: 1, scaleY: 1, autoAlpha: 0.6 }, { scaleX: 1.12, scaleY: 1.45, autoAlpha: 0, duration: 1.1, ease: "power2.out", immediateRender: false }, 0.55)
            .to(q("[data-seta]"), { keyframes: { x: [0, 6, 0, 4, 0] }, duration: 0.9, ease: "sine.inOut" }, 0.6);
          let sobreBotao = false;
          const olho = new IntersectionObserver(([e]) => (e.isIntersecting && !sobreBotao ? chamado.play() : chamado.pause()));
          ajuda.eventCallback("onComplete", () => olho.observe(q("[data-ajuda]")[0]));

          /* botão magnético: acompanha o ponteiro de leve e volta com mola */
          const botao = q("[data-botao]")[0] as HTMLElement | undefined;
          if (!botao || !desk) return () => olho.disconnect();
          {
            // com o ponteiro em cima, o ciclo para (a seta passa a seguir o mouse)
            const entrar = () => {
              sobreBotao = true;
              chamado.pause();
              gsap.set(q("[data-botao-anel]"), { autoAlpha: 0 });
            };
            const largar = () => {
              sobreBotao = false;
              if (ajuda.progress() === 1) chamado.play();
            };
            botao.addEventListener("pointerenter", entrar);
            botao.addEventListener("pointerleave", largar);
            const xTo = gsap.quickTo(botao, "x", { duration: 0.4, ease: "power3.out" });
            const yTo = gsap.quickTo(botao, "y", { duration: 0.4, ease: "power3.out" });
            const seta = gsap.quickTo(q("[data-seta]"), "x", { duration: 0.3, ease: "power3.out" });
            const mover = (e: PointerEvent) => {
              const r = botao.getBoundingClientRect();
              xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
              yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
              seta(4);
            };
            const sair = () => {
              gsap.to(botao, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
              seta(0);
            };
            botao.addEventListener("pointermove", mover);
            botao.addEventListener("pointerleave", sair);
            return () => {
              olho.disconnect();
              botao.removeEventListener("pointerenter", entrar);
              botao.removeEventListener("pointerleave", largar);
              botao.removeEventListener("pointermove", mover);
              botao.removeEventListener("pointerleave", sair);
            };
          }
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div className={`wide ${styles.disp}`} ref={ref}>
      <div className={styles.topo} data-topo>
        <span className={styles.selo} data-selo>
          <i />
          Em implantação
        </span>
        <h2 id="disponibilidade" data-titulo>
          Disponibilidade
        </h2>
        <p className={styles.lead} data-lead>
          O SISConforme está em implantação. A primeira fase atende empresas prestadoras de serviço com inscrição
          municipal em Porto Velho, incluindo optantes do Simples Nacional. O acesso para escritórios de contabilidade e
          o painel interno da auditoria entram na sequência.
        </p>
      </div>

      <aside className={styles.ajuda} data-ajuda>
        <span className={styles.reflexo} data-reflexo aria-hidden />
        <span className={styles.interroga} data-interroga aria-hidden>
          ?
        </span>
        <h3 data-ajuda-txt>Precisa de ajuda?</h3>
        <p data-ajuda-txt>
          Dúvidas sobre o SISConforme podem ser encaminhadas à Secretaria Municipal de Economia, pelos canais oficiais de
          atendimento da Prefeitura de Porto Velho.
        </p>
        <a className={styles.botao} data-botao href={FALE_CONOSCO} target="_blank" rel="noopener noreferrer">
          <span className={styles.botaoAnel} data-botao-anel aria-hidden />
          Fale conosco
          <span data-seta aria-hidden>
            →
          </span>
          <span className={styles.leitor}>(abre em nova aba)</span>
        </a>
      </aside>
    </div>
  );
}
