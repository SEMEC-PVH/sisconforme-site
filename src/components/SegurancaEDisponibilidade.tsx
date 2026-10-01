"use client";

import { useRef } from "react";
import { aoEntrar, COM_MOVIMENTO, gsap, useGSAP } from "@/lib/gsap";
import Disponibilidade from "./Disponibilidade";
import styles from "./Seguranca.module.css";
import MotionConsulta from "./seguranca/MotionConsulta";
import MotionEmpresas from "./seguranca/MotionEmpresas";
import MotionFontes from "./seguranca/MotionFontes";
import MotionGovBr from "./seguranca/MotionGovBr";

/* Único ícone da seção. Só <path>: os testes contam os <rect> e <polyline> do artigo (gráficos). */
function Escudo() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="44"
      height="44"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path data-traco d="M24 4 40 10v12c0 10.5-6.8 18.6-16 22-9.2-3.4-16-11.5-16-22V10z" pathLength={1} />
      <path data-traco d="M19 22v-3a5 5 0 0 1 10 0v3" pathLength={1} />
      <path data-traco d="M17.5 22h13v9.5h-13z" pathLength={1} />
    </svg>
  );
}

function Cabecalho({ num, titulo, pergunta }: Readonly<{ num: string; titulo: string; pergunta: string }>) {
  return (
    <div className={styles.cab}>
      <span className={styles.linha} data-linha />
      <span className={styles.num}>{num}</span>
      <h3>{titulo}</h3>
      <p className={styles.pergunta}>{pergunta}</p>
    </div>
  );
}

export default function SegurancaEDisponibilidade() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const raiz = ref.current;
      if (!raiz) return;
      const mm = gsap.matchMedia();
      mm.add(COM_MOVIMENTO, () => {
        // escudo do cabeçalho se desenha
        const tracos = raiz.querySelectorAll("[data-traco]");
        aoEntrar(
          tracos[0],
          gsap.fromTo(
            tracos,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: "power2.inOut",
              stagger: 0.15,
              onComplete: () => gsap.set(tracos, { clearProps: "strokeDasharray,strokeDashoffset" }),
            },
          ),
        );

        // cada cartão: a linha de destaque corre e o número sobe
        raiz.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
          const tl = gsap.timeline();
          aoEntrar(card, tl);
          tl.from(card.querySelector("[data-linha]"), { scaleX: 0, duration: 0.9, ease: "power3.inOut" }, 0.2).from(
            card.querySelector(`.${styles.num}`),
            { autoAlpha: 0, y: 10, duration: 0.5, ease: "power2.out" },
            0.35,
          );
        });

        // as animações contínuas (CSS) só rodam enquanto a seção está na tela.
        // (um IntersectionObserver basta aqui; não precisa de ScrollTrigger)
        const olho = new IntersectionObserver(([e]) => raiz.classList.toggle(styles.vivo, e.isIntersecting));
        olho.observe(raiz);
        return () => olho.disconnect();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div className={styles.sec} ref={ref}>
      <div className={`wide ${styles.topo}`} data-revelar>
        <div className={styles.escudo}>
          <Escudo />
        </div>
        <div>
          <p className={styles.sobre}>Segurança</p>
          <h2 id="seguranca">Seus dados fiscais são protegidos.</h2>
          <p className={styles.intro}>
            Dado fiscal é sigiloso por lei. O art. 198 do CTN veda a divulgação da situação econômica do contribuinte, e
            a LGPD rege o tratamento de dados pessoais de sócios e representantes. O SISConforme foi desenhado a partir
            dessas duas regras.
          </p>
        </div>
      </div>

      <div className={`wide ${styles.grade}`}>
        <section className={styles.card} data-card data-revelar>
          <Cabecalho num="01" titulo="Acesso seguro" pergunta="Quem pode entrar?" />
          <p className={styles.texto}>O acesso é feito somente pela conta gov.br (Login Único).</p>
          <MotionGovBr />
          <p className={styles.sem}>Não existem senhas próprias do portal para vazar ou esquecer.</p>
        </section>

        <section className={styles.card} data-card data-revelar>
          <Cabecalho num="02" titulo="Acesso por empresa" pergunta="Quem pode ver os dados?" />
          <p className={styles.texto}>
            Cada empresa acessa somente os próprios dados. O contador acessa apenas as empresas que representa por
            procuração eletrônica.
          </p>
          <MotionEmpresas />
          <p className={styles.sem}>O vínculo do contador vem da procuração eletrônica.</p>
        </section>

        <section className={styles.card} data-card data-revelar>
          <Cabecalho num="03" titulo="Dados utilizados" pergunta="O que é comparado?" />
          <p className={styles.texto}>O SISConforme compara dados de:</p>
          <MotionFontes />
          <p className={styles.nota}>
            Os dados de pagamentos são compartilhados pela SEFIN-RO, conforme convênio, e usados exclusivamente para
            fins fiscais.
          </p>
        </section>

        <section className={styles.card} data-card data-revelar>
          <Cabecalho num="04" titulo="Somente consulta" pergunta="O sistema pode alterar os dados?" />
          <MotionConsulta />
          <p className={styles.texto}>
            O SISConforme consulta informações já validadas. Qualquer emissão ou alteração segue os procedimentos
            oficiais de cada sistema.
          </p>
          <p className={styles.aviso}>Somente leitura: o portal não altera as bases consultadas.</p>
        </section>
      </div>

      <div className={`wide ${styles.base}`} data-revelar>
        <span className={styles.baseTit}>Base legal</span>
        <p>
          O tratamento das informações observa as regras de sigilo fiscal do art. 198 do Código Tributário Nacional
          (CTN) e as normas de proteção de dados da LGPD.
        </p>
      </div>

      <Disponibilidade />
    </div>
  );
}
