"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, easeInCubic, easeInOutQuad, easeOutBack, progressoDoScroll, seg, useScrollFrame } from "@/lib/scroll";
import Ana from "./Ana";
import CenaObjetos, { BASE, MAX_MOEDAS, OBJ, PASSO, PRIMEIRA, VALORES } from "./objetos";
import { expressaoEm, legendaEm, LEGENDAS, ROTEIRO_ACESSIVEL, type Expressao } from "./roteiro";
import styles from "./HistoriaDonaAna.module.css";

function dinheiro(v: number): string {
  return "R$ " + v.toFixed(1).replace(".", ",") + " mil";
}

function escalar(elemento: SVGElement, cx: number, cy: number, s: number) {
  elemento.setAttribute("transform", `translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`);
}

function preciso<T extends Element>(raiz: ParentNode, seletor: string): T {
  const achado = raiz.querySelector<T>(seletor);
  if (!achado) throw new Error(`história: elemento não encontrado (${seletor})`);
  return achado;
}

interface Elementos {
  card: HTMLDivElement;
  caps: HTMLElement[];
  ana: HTMLDivElement;
  letter: HTMLDivElement;
  paper: HTMLDivElement;
  objs: SVGSVGElement;
  O: SVGGElement[];
  COIN: SVGGElement[][];
  V: SVGTextElement[];
  G: SVGGElement[];
  linha: SVGLineElement;
  gap: SVGGElement;
  ok: SVGGElement;
  sparks: SVGGElement;
  phone: HTMLDivElement;
  note: HTMLDivElement;
  steps: HTMLElement[];
  btn: HTMLDivElement;
  bar: HTMLDivElement;
}

export default function HistoriaDonaAna() {
  const [expressao, setExpressao] = useState<Expressao>("neutra");
  const [popAtivo, setPopAtivo] = useState(false);
  const trocas = useRef(0);
  const exprAnterior = useRef<Expressao | null>(null);
  const estatico = useRef(false);
  const elsRef = useRef<Elementos | null>(null);

  const secRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const capsRef = useRef<HTMLDivElement>(null);
  const anaRef = useRef<HTMLDivElement>(null);
  const objsRef = useRef<SVGSVGElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  function render(p: number) {
    const e = elsRef.current;
    if (!e) return;
    // cartão cresce até a tela cheia
    const g = easeInOutQuad(seg(p, 0, 0.1));
    const sc = 0.36 + 0.64 * g;
    e.card.style.transform = `scale(${sc})`;
    e.card.style.borderRadius = `${((1 - g) * 28) / sc}px`;
    // legendas
    e.caps.forEach((c, i) => {
      const { opacidade, deslocamento } = legendaEm(i, p);
      c.style.opacity = `${opacidade}`;
      c.style.transform = `translateY(${deslocamento}px)`;
      c.style.visibility = opacidade < 0.01 ? "hidden" : "visible";
    });
    // Dona Ana entra e troca de expressão
    const ae = seg(p, 0.02, 0.09);
    e.ana.style.opacity = `${clamp(ae * 2)}`;
    e.ana.style.transform = `translateX(${(1 - easeOutBack(ae)) * -45}%)`;
    const nova = expressaoEm(p);
    if (nova !== exprAnterior.current) {
      if (exprAnterior.current !== null) {
        trocas.current += 1;
        setPopAtivo(true);
      }
      exprAnterior.current = nova;
      setExpressao(nova);
    }
    // notificação tradicional: entra, desenrola, sai voando
    const li = easeOutBack(seg(p, 0.13, 0.17));
    const lu = easeInOutQuad(seg(p, 0.15, 0.21));
    const lo = easeInCubic(seg(p, 0.23, 0.27));
    e.letter.style.opacity = `${Math.min(clamp(seg(p, 0.13, 0.17) * 3), 1 - lo)}`;
    e.letter.style.transform = `translate(${(1 - li) * 70 + lo * 50}%,${-lo * 70}%) rotate(${(1 - li) * 14 - 3 + lo * 22}deg)`;
    e.paper.style.clipPath = `inset(0 0 ${(1 - lu) * 78}% 0)`;
    // objetos caem e se acomodam
    OBJ.forEach((o, i) => {
      const d = seg(p, 0.27 + i * 0.02, 0.31 + i * 0.02);
      const b = easeOutBack(d);
      e.O[i].setAttribute("opacity", `${clamp(d * 3)}`);
      e.O[i].setAttribute(
        "transform",
        `translate(${o.x} ${o.y - 140 * (1 - b)}) rotate(${(1 - d) * o.r} ${(o.w * o.s) / 2} ${(o.h * o.s) / 2})`,
      );
    });
    // moedas caem uma a uma
    e.COIN.forEach((pilha, i) => {
      pilha.forEach((c, k) => {
        const t = k < PRIMEIRA[i] ? 0.33 + i * 0.012 + k * (0.085 / MAX_MOEDAS) : 0.74 + (i - 1) * 0.01 + (k - 11) * 0.018;
        const d = seg(p, t, t + 0.015);
        c.setAttribute("opacity", `${clamp(d * 5)}`);
        c.setAttribute("transform", `translate(0 ${-70 * (1 - d * d)})`);
      });
    });
    e.V.forEach((v, i) => {
      const f = easeInOutQuad(seg(p, 0.33 + i * 0.01, 0.43 + i * 0.01));
      const val = VALORES[i] * f + (i ? (97.5 - VALORES[i]) * easeInOutQuad(seg(p, 0.74, 0.83)) : 0);
      v.textContent = f > 0 ? dinheiro(val) : "";
    });
    // divergência
    const lg = easeInOutQuad(seg(p, 0.43, 0.47));
    const fade = 1 - seg(p, 0.72, 0.75);
    e.linha.setAttribute("x2", `${150 + 370 * lg}`);
    e.linha.setAttribute("opacity", `${fade}`);
    const gb = easeOutBack(seg(p, 0.46, 0.49));
    e.gap.setAttribute("opacity", `${gb > 0 ? fade : 0}`);
    escalar(e.gap, 395, BASE - 12.5 * PASSO, Math.max(gb, 0.001));
    const ghost = seg(p, 0.44, 0.47) * (1 - seg(p, 0.8, 0.84));
    e.G.forEach((x) => x.setAttribute("opacity", `${ghost}`));
    // celular com o alerta
    const dim = seg(p, 0.555, 0.58) * (1 - seg(p, 0.705, 0.73));
    e.objs.style.opacity = `${1 - 0.78 * dim}`;
    e.objs.style.transform = `scale(${1 - 0.05 * dim})`;
    const pi = easeOutBack(seg(p, 0.56, 0.6));
    const po = easeInCubic(seg(p, 0.7, 0.73));
    e.phone.style.opacity = `${Math.min(clamp(seg(p, 0.56, 0.6) * 3), 1 - po)}`;
    e.phone.style.transform = `translateY(${(1 - pi) * 120 + po * 130}%) rotate(${(1 - pi) * 8 - po * 6}deg)`;
    e.phone.classList.toggle(styles.buzz, p > 0.6 && p < 0.66);
    const n = easeOutBack(seg(p, 0.6, 0.625));
    e.note.style.opacity = `${clamp(n)}`;
    e.note.style.transform = `translateY(${(1 - n) * -120}%)`;
    [...e.steps, e.btn].forEach((s, k) => {
      const d = seg(p, 0.625 + k * 0.015, 0.64 + k * 0.015);
      s.style.opacity = `${d}`;
      s.style.transform = `translateX(${(1 - d) * 16}px)`;
    });
    const press = seg(p, 0.675, 0.68) * (1 - seg(p, 0.69, 0.695));
    const done = p >= 0.69;
    e.btn.style.transform = `scale(${1 - 0.07 * press})`;
    e.btn.classList.toggle(styles.done, done);
    e.btn.textContent = done ? "✓ Notas emitidas" : "Emitir notas faltantes";
    // tudo confere
    const ob = easeOutBack(seg(p, 0.83, 0.86));
    e.ok.setAttribute("opacity", ob > 0 ? "1" : "0");
    escalar(e.ok, 300, 168, Math.max(ob, 0.001));
    e.sparks.setAttribute("opacity", `${seg(p, 0.84, 0.87)}`);
    e.bar.style.width = p * 100 + "%";
  }

  useEffect(() => {
    const objs = objsRef.current;
    const caps = capsRef.current;
    const stepsEl = stepsRef.current;
    if (
      !objs ||
      !caps ||
      !stepsEl ||
      !cardRef.current ||
      !anaRef.current ||
      !letterRef.current ||
      !paperRef.current ||
      !phoneRef.current ||
      !noteRef.current ||
      !btnRef.current ||
      !barRef.current
    ) {
      return;
    }
    elsRef.current = {
      card: cardRef.current,
      caps: Array.from(caps.children) as HTMLElement[],
      ana: anaRef.current,
      letter: letterRef.current,
      paper: paperRef.current,
      objs,
      O: OBJ.map((_, i) => preciso<SVGGElement>(objs, `[data-objeto="${i}"]`)),
      COIN: VALORES.map((_, i) =>
        Array.from({ length: MAX_MOEDAS }, (_, k) => preciso<SVGGElement>(objs, `[data-moeda="${i}-${k}"]`)),
      ),
      V: VALORES.map((_, i) => preciso<SVGTextElement>(objs, `[data-valor="${i}"]`)),
      G: Array.from(objs.querySelectorAll<SVGGElement>("[data-fantasma]")),
      linha: preciso<SVGLineElement>(objs, "[data-linha]"),
      gap: preciso<SVGGElement>(objs, '[data-selo="gap"]'),
      ok: preciso<SVGGElement>(objs, '[data-selo="ok"]'),
      sparks: preciso<SVGGElement>(objs, "[data-brilhos]"),
      phone: phoneRef.current,
      note: noteRef.current,
      steps: Array.from(stepsEl.children) as HTMLElement[],
      btn: btnRef.current,
      bar: barRef.current,
    };
  }, []);

  useEffect(() => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzir) {
      estatico.current = true;
      secRef.current?.classList.add(styles.static);
      render(1);
    }
  }, []);

  useScrollFrame(() => {
    const sec = secRef.current;
    if (!sec || estatico.current) return;
    const r = sec.getBoundingClientRect();
    const vh = window.innerHeight;
    sec.classList.toggle(styles.on, r.top < vh && r.bottom > 0);
    if (r.top > vh || r.bottom < 0) return;
    render(progressoDoScroll(sec));
  });

  return (
    <section className={styles.hs} id="como-funciona" aria-labelledby="hs-title" ref={secRef}>
      <h2 id="hs-title" className={styles.sr}>
        Como funciona o SISConforme
      </h2>
      <div className={styles.pin}>
        <div className={styles.card} ref={cardRef}>
          <div className={styles.caps} aria-hidden="true" ref={capsRef}>
            {LEGENDAS.map((legenda, i) => (
              <div className={styles.cap} key={i}>
                {legenda.kicker && <p className={styles.k}>{legenda.kicker}</p>}
                <p className={styles.t}>{legenda.titulo}</p>
                {legenda.sub && <p className={styles.s}>{legenda.sub}</p>}
                {legenda.cta && (
                  <div className={styles.actions}>
                    <a className={styles.go} href="#disponibilidade" tabIndex={-1}>
                      Acessar portal
                    </a>
                    <a className={styles.more} href="#introducao" tabIndex={-1}>
                      Saiba mais ↓
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className={styles.ana} aria-hidden="true" ref={anaRef}>
            <div key={expressao} className={`${styles.pop} ${popAtivo ? styles.popAtivo : ""}`}>
              <Ana expressao={expressao} />
            </div>
          </div>
          <div className={styles.scene} aria-hidden="true">
            <CenaObjetos ref={objsRef} />
            <div className={styles.letter} ref={letterRef}>
              <div className={styles.paper} ref={paperRef}>
                <div className={styles.lh}>
                  <b>NOTIFICAÇÃO FISCAL</b>
                  <span>Nº 0457/2026 · Secretaria Municipal</span>
                </div>
                <p>
                  Fica o contribuinte acima qualificado NOTIFICADO a apresentar, no prazo de 10 (dez) dias,
                  documentação comprobatória referente às operações do período de apuração 05/2026, tendo em vista
                  indícios de omissão de receitas apurados em procedimento de cruzamento de informações, sob pena de
                  lançamento de ofício do crédito tributário e aplicação das penalidades cabíveis previstas na
                  legislação tributária municipal.
                </p>
                <p>
                  O não atendimento à presente no prazo assinalado caracterizará embaraço à fiscalização, sujeitando
                  o infrator às sanções previstas, sem prejuízo da constituição do crédito tributário por
                  arbitramento, nos termos da legislação vigente.
                </p>
                <div className={styles.stamp}>PRAZO: 10 DIAS</div>
              </div>
            </div>
            <div className={styles.phone} ref={phoneRef}>
              <div className={styles.body}>
                <div className={styles.scr}>
                  <div className={styles.status}>
                    <span>09:41</span>
                    <i></i>
                    <span>5G</span>
                  </div>
                  <div className={styles.note} ref={noteRef}>
                    <div className={styles.app}>
                      <i></i>SISConforme · agora
                    </div>
                    <b>Maio/2026: R$ 26.240</b>
                    <span>recebidos no cartão sem nota fiscal correspondente.</span>
                  </div>
                  <ol className={styles.steps} ref={stepsRef}>
                    <li>
                      <em>1</em>Emitir as NFS-e faltantes
                    </li>
                    <li>
                      <em>2</em>Retificar o PGDAS de maio
                    </li>
                    <li>
                      <em>3</em>Ou justificar a diferença
                    </li>
                  </ol>
                  <div className={styles.btn} ref={btnRef}>
                    Emitir notas faltantes
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bar} ref={barRef}></div>
        </div>
      </div>
      <ol className={styles.sr}>
        {ROTEIRO_ACESSIVEL.map((texto, i) => (
          <li key={i}>
            {texto}
            {i === ROTEIRO_ACESSIVEL.length - 1 && (
              <>
                {" "}
                <a href="#disponibilidade">Acessar portal</a>.
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
