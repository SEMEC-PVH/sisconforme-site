"use client";

import { Fragment, type Ref, useRef, useState } from "react";
import { COM_MOVIMENTO, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./GraficoAbas.module.css";

interface Serie {
  n: string;
  c: string;
  v: number[];
}

export interface DadosGrafico {
  title: string;
  sub: string;
  series: Serie[];
  max: number;
  step: number;
  type: "line" | "bar";
  cap: string;
}

// séries nas cores da marca: azul, petróleo, laranja e cinza
const COL = { clay: "#1677E8", green: "#174A5B", gold: "#D87535", slate: "#68717C" };
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago"];

export const DADOS_GRAFICO: Record<"a" | "b", DadosGrafico> = {
  a: {
    title: "Divergências por competência",
    sub: "Quantidade de alertas · dados ilustrativos",
    series: [
      { n: "Cartão × NFS-e", c: COL.clay, v: [412, 398, 436, 421, 455, 430, 402, 388] },
      { n: "NFS-e × PGDAS", c: COL.green, v: [138, 141, 129, 150, 162, 147, 133, 128] },
      { n: "Cartão × PGDAS", c: COL.gold, v: [96, 102, 91, 110, 118, 104, 99, 94] },
    ],
    max: 500,
    step: 100,
    type: "line",
    cap: "Simulação para demonstração da interface. Os números reais serão publicados após o primeiro ciclo completo da malha.",
  },
  b: {
    title: "Regularização após o alerta",
    sub: "% de alertas resolvidos · dados ilustrativos",
    series: [
      { n: "Até 30 dias", c: COL.clay, v: [38] },
      { n: "Até 60 dias", c: COL.green, v: [57] },
      { n: "Até 90 dias", c: COL.gold, v: [66] },
      { n: "Sem resposta", c: COL.slate, v: [34] },
    ],
    max: 100,
    step: 20,
    type: "bar",
    cap: "Meta de referência para o piloto. Alertas sem resposta em 90 dias seguem para fiscalização.",
  },
};

const W = 820;
const H = 360;
const L = 56;
const R = 20;
const T = 16;
const B = 48;
const IW = W - L - R;
const IH = H - T - B;

export const escalaY = (v: number, max: number): number => T + IH - (v / max) * IH;

const xLinha = (i: number) => L + (IW * (i + 0.5)) / MESES.length;

export default function GraficoAbas() {
  const [aba, setAba] = useState<"a" | "b">("a");
  const d = DADOS_GRAFICO[aba];
  const svgRef = useRef<SVGSVGElement>(null);
  /** O gráfico já apareceu na tela: ao trocar de aba, desenha na hora. */
  const jaVisto = useRef(false);

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;
      const mm = gsap.matchMedia();
      mm.add(COM_MOVIMENTO, () => {
        const linhas = svg.querySelectorAll("polyline");
        linhas.forEach((l) => {
          const n = l.getTotalLength();
          gsap.set(l, { strokeDasharray: n, strokeDashoffset: n });
        });
        // cada aba só tem um tipo de marca (linhas e pontos, ou barras): animar o que não existe faz o GSAP avisar no console
        const desenho = gsap.timeline({ paused: true });
        if (d.type === "line") {
          desenho
            .to(linhas, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.15 })
            .from(svg.querySelectorAll("circle"), { scale: 0, transformOrigin: "center", duration: 0.3, stagger: 0.02 }, "-=0.6");
        } else {
          desenho.from(svg.querySelectorAll("rect"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.8, ease: "power2.out", stagger: 0.12 });
        }
        if (jaVisto.current) {
          desenho.play();
        } else {
          ScrollTrigger.create({
            trigger: svg,
            start: "top 75%",
            once: true,
            onEnter: () => {
              jaVisto.current = true;
              desenho.play();
            },
          });
        }
      });
      return () => mm.revert();
    },
    { dependencies: [aba], scope: svgRef, revertOnUpdate: true },
  );

  return (
    <div className={`wide block ${styles.chart}`}>
      <div className={`tabs ${styles.abas}`} role="tablist">
        <button role="tab" aria-selected={aba === "a"} onClick={() => setAba("a")}>
          Divergências por competência
        </button>
        <button role="tab" aria-selected={aba === "b"} onClick={() => setAba("b")}>
          Regularização após o alerta
        </button>
      </div>
      <Grafico d={d} svgRef={svgRef} />
      {/* sem JS as abas não trocam: os outros gráficos aparecem logo abaixo (só nesse caso, via CSS) */}
      <div className={styles.soSemJs}>
        {(Object.keys(DADOS_GRAFICO) as ("a" | "b")[])
          .filter((k) => k !== aba)
          .map((k) => (
            <Grafico key={k} d={DADOS_GRAFICO[k]} />
          ))}
      </div>
    </div>
  );
}

/** Um gráfico com a legenda e a nota de rodapé. */
function Grafico({ d, svgRef }: Readonly<{ d: DadosGrafico; svgRef?: Ref<SVGSVGElement> }>) {
  const niveis: number[] = [];
  for (let v = 0; v <= d.max; v += d.step) niveis.push(v);

  return (
    <>
      <div className={styles.chartbox} data-revelar>
        <div className={styles.chartHead}>
          <span>{d.title}</span>
          <em>{d.sub}</em>
        </div>
        <div className={styles.legend}>
          {d.series.map((s) => (
            <span key={s.n}>
              <i style={{ background: s.c }}></i>
              {s.n}
            </span>
          ))}
        </div>
        <svg ref={svgRef} viewBox="0 0 820 360" role="img" aria-label={d.title}>
          {niveis.map((v) => (
            <Fragment key={v}>
              <line
                x1={L}
                x2={W - R}
                y1={escalaY(v, d.max)}
                y2={escalaY(v, d.max)}
                stroke={v ? "#E2DFD6" : "#20252B"}
                strokeWidth={v ? 1 : 1.2}
              />
              <text x={L - 12} y={escalaY(v, d.max) + 4} textAnchor="end" fontSize={12}>
                {d.type === "bar" ? `${v}%` : v}
              </text>
            </Fragment>
          ))}
          <line x1={L} x2={L} y1={T} y2={T + IH} stroke="#20252B" strokeWidth={1.2} />
          {d.type === "line" ? (
            <>
              {MESES.map((m, i) => (
                <text key={m} x={xLinha(i)} y={H - B + 22} textAnchor="middle" fontSize={12}>
                  {m}/26
                </text>
              ))}
              <text className={styles.eixo} x={L + IW / 2} y={H - 4} textAnchor="middle" fontSize={13}>
                Competência
              </text>
              {d.series.map((s) => (
                <Fragment key={s.n}>
                  <polyline
                    fill="none"
                    stroke={s.c}
                    strokeWidth={2.2}
                    points={s.v.map((v, i) => `${xLinha(i)},${escalaY(v, d.max)}`).join(" ")}
                  />
                  {s.v.map((v, i) => (
                    <circle
                      key={i}
                      cx={xLinha(i)}
                      cy={escalaY(v, d.max)}
                      r={5.5}
                      fill={s.c}
                      stroke="#20252B"
                      strokeWidth={1}
                    >
                      <title>{`${s.n} · ${MESES[i]}/26: ${v}`}</title>
                    </circle>
                  ))}
                </Fragment>
              ))}
            </>
          ) : (
            d.series.map((s, i) => {
              const n = d.series.length;
              const bw = Math.min(90, (IW / n) * 0.45);
              const cx = L + (IW * (i + 0.5)) / n;
              const v = s.v[0];
              return (
                <Fragment key={s.n}>
                  <rect
                    x={cx - bw / 2}
                    y={escalaY(v, d.max)}
                    width={bw}
                    height={escalaY(0, d.max) - escalaY(v, d.max)}
                    fill={s.c}
                    stroke="#20252B"
                    strokeWidth={1}
                  />
                  <text x={cx} y={escalaY(v, d.max) - 8} textAnchor="middle" fontSize={13} fontWeight={600}>
                    {v}%
                  </text>
                  <text x={cx} y={H - B + 22} textAnchor="middle" fontSize={12}>
                    {s.n}
                  </text>
                </Fragment>
              );
            })
          )}
        </svg>
      </div>
      <p className="caption">{d.cap}</p>
    </>
  );
}
