"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import styles from "./Disponibilidade.module.css";

const PASSOS = [
  { titulo: "Compare seus dados", texto: "Veja as informações que o Fisco também tem." },
  { titulo: "Entenda a diferença", texto: "Saiba o que não confere e o valor da divergência." },
  { titulo: "Corrija pelo portal", texto: "Regularize sua situação de forma simples e sem burocracia." },
];

const FALE_CONOSCO = "https://semecdigital.portovelho.ro.gov.br/fale-conosco";

/* Cores dos números: apagado (antes do cometa passar) e aceso (etapa concluída). */
const APAGADO = { backgroundColor: "#DCE9FB", color: "#1677E8" };
const ACESO = { backgroundColor: "#1677E8", color: "#FFFFFF" };

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
          gsap
            .timeline({
              scrollTrigger: { trigger: q("[data-topo]")[0], start: "top 82%", once: true },
              onComplete: () => {
                titulo.revert();
                lead.revert();
              },
            })
            .from(q("[data-selo]"), { autoAlpha: 0, y: 12, scale: 0.7, duration: 0.6, ease: "back.out(2.4)" })
            .from(titulo.chars, { yPercent: 115, duration: 0.8, ease: "power4.out", stagger: 0.028 }, "-=0.3")
            .from(lead.lines, { yPercent: 100, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.09 }, "-=0.55");

          /* ---------- 2. passos: o cometa percorre a trilha e acende cada etapa ---------- */
          const nums = q("[data-num]");
          const aneis = q("[data-anel]");
          const titulos = q("[data-passo-tit]");
          const textos = q("[data-passo-txt]");
          const conectores = q("[data-conector]");

          const intro = gsap.timeline({
            scrollTrigger: { trigger: q("[data-passos]")[0], start: "top 78%", once: true },
            defaults: { ease: "power2.out" },
          });
          intro
            .from(q("[data-passos]"), { autoAlpha: 0, y: 40, scale: 0.97, duration: 0.8, ease: "power3.out" })
            .fromTo(nums, { scale: 0.4, autoAlpha: 0, ...APAGADO }, { scale: 1, autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: "back.out(2)" }, "-=0.35")
            .from(titulos, { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.12 }, "<0.1")
            .from(textos, { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.12 }, "<0.1");

          /** Etapa i acende: número enche de azul, dá um "pulo" e solta um anel. */
          const acender = (i: number) =>
            gsap
              .timeline()
              .to(nums[i], { ...ACESO, duration: 0.3, ease: "none" }, 0)
              .to(nums[i], { keyframes: { scale: [1, 1.22, 1] }, duration: 0.55, ease: "power2.out" }, 0)
              .fromTo(aneis[i], { scale: 1, autoAlpha: 0.7 }, { scale: 2.4, autoAlpha: 0, duration: 0.9, ease: "power2.out" }, 0)
              .fromTo(titulos[i], { color: "#1677E8" }, { color: "#10233F", duration: 0.9 }, 0);

          const percurso = gsap.timeline();
          percurso.add(acender(0));
          if (desk) {
            // trilha: preenchimento azul + cometa na ponta, com pausa curta em cada número
            percurso
              .fromTo(q("[data-cometa]"), { left: "0%", autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.2)
              .fromTo(q("[data-preenche]"), { scaleX: 0 }, { scaleX: 0.5, duration: 0.9, ease: "power2.inOut" }, 0.3)
              .to(q("[data-cometa]"), { left: "50%", duration: 0.9, ease: "power2.inOut" }, 0.3)
              .add(acender(1), ">-0.05")
              .to(q("[data-preenche]"), { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, ">0.15")
              .to(q("[data-cometa]"), { left: "100%", duration: 0.9, ease: "power2.inOut" }, "<")
              .add(acender(2), ">-0.05")
              .to(q("[data-cometa]"), { autoAlpha: 0, scale: 2, duration: 0.5 }, "<");
          } else {
            // celular: os conectores verticais crescem um de cada vez
            conectores.forEach((c, i) => {
              percurso.fromTo(c, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.inOut" }, ">0.1").add(acender(i + 1), ">-0.05");
            });
          }
          intro.add(percurso, "+=0.1");

          // depois da entrada: um brilho volta a percorrer as etapas, de tempos em tempos, só com a seção na tela
          const brilho = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.6 });
          nums.forEach((n, i) => {
            brilho
              .to(n, { keyframes: { scale: [1, 1.12, 1] }, duration: 0.5, ease: "sine.inOut" }, i * 0.35)
              .fromTo(aneis[i], { scale: 1, autoAlpha: 0.45 }, { scale: 1.9, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, i * 0.35);
          });
          intro.eventCallback("onComplete", () => {
            ScrollTrigger.create({
              trigger: q("[data-passos]")[0],
              start: "top bottom",
              end: "bottom top",
              onToggle: (st) => (st.isActive ? brilho.play() : brilho.pause()),
            });
            brilho.play();
          });

          /* ---------- 3. quadro de ajuda: entra, reflexo atravessa, "?" gira e flutua ---------- */
          gsap
            .timeline({ scrollTrigger: { trigger: q("[data-ajuda]")[0], start: "top 86%", once: true } })
            .from(q("[data-ajuda]"), { autoAlpha: 0, y: 30, duration: 0.7, ease: "power3.out" })
            .from(q("[data-interroga]"), { scale: 0, rotate: -120, duration: 1.1, ease: "elastic.out(1, 0.5)" }, "-=0.35")
            .from(q("[data-ajuda-txt]"), { autoAlpha: 0, x: -14, duration: 0.5, stagger: 0.1 }, "<0.15")
            .from(q("[data-botao]"), { autoAlpha: 0, x: 18, duration: 0.5, ease: "back.out(2)" }, "<0.2")
            .fromTo(q("[data-reflexo]"), { xPercent: -120 }, { xPercent: 260, duration: 1.3, ease: "power2.inOut" }, "<");

          gsap.to(q("[data-interroga]"), { y: -4, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.5 });
          gsap.to(q("[data-interroga]"), {
            keyframes: { rotate: [0, -12, 10, -6, 0] },
            duration: 0.9,
            ease: "sine.inOut",
            repeat: -1,
            repeatDelay: 5,
            delay: 3,
          });

          /* botão magnético: acompanha o ponteiro de leve e volta com mola */
          const botao = q("[data-botao]")[0] as HTMLElement | undefined;
          if (botao && desk) {
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

      <div className={styles.passos} data-passos>
        <span className={styles.trilho} aria-hidden>
          <span className={styles.preenche} data-preenche />
          <span className={styles.cometa} data-cometa />
        </span>
        <ol>
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className={styles.passo}>
              <span className={styles.num} data-num>
                <span className={styles.anel} data-anel aria-hidden />
                {i + 1}
              </span>
              {i < PASSOS.length - 1 && <span className={styles.conector} data-conector aria-hidden />}
              <div>
                <h3 data-passo-tit>{p.titulo}</h3>
                <p data-passo-txt>{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
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
