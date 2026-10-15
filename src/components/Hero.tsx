"use client";

import { useEffect, useRef } from "react";
import { emLaco, gsap } from "@/lib/gsap";
import { clamp, easeOutCubic } from "@/lib/scroll";
import { caminho } from "@/lib/caminho";
import styles from "./Hero.module.css";

/*
 * Hero — variação B "Caixas d'água" (protótipo: prototipos/hero/_template-b.html).
 * Ao abrir, as três casas do símbolo enchem de imagem como caixas d'água (animação por tempo).
 * Ao rolar, a câmera mergulha pela casa do meio até o pôr do sol ocupar a tela e o texto entra (animação por scroll).
 * A lógica é imperativa (rAF + escrita direta de atributos/estilos), como nas outras seções com scroll.
 */

const CONFIG = {
  enchimento: { atrasoMs: 250, entreCasasMs: 380, duracaoMs: 1500, onda: 12 },
  logoInicial: { alturaTela: 0.66, larguraTela: 0.84 },
  // intervalos do progresso do scroll (0 = topo da seção, 1 = fim)
  mergulho: [0.03, 0.42],
  somemLados: [0.14, 0.34],
  someContorno: [0.12, 0.28],
  legenda: [0.0, 0.06],
  veu: [0.38, 0.52],
  marca: [0.4, 0.56],
  nome: [0.46, 0.58],
  frase: [0.52, 0.64],
  cta: [0.6, 0.72],
  doca: [0.66, 0.8], // faixa de vidro com os 3 passos, no rodapé da tela (protótipo: prototipos/hero/hero-passos.html, opção B)
  passo: 0.035, // atraso entre um passo e o próximo dentro da faixa
} as const;

const PASSOS = [
  { titulo: "Compare seus dados", texto: "Veja as informações que o Fisco também tem." },
  { titulo: "Entenda a diferença", texto: "Saiba o que não confere e o valor da divergência." },
  { titulo: "Corrija pelo portal", texto: "Regularize sua situação de forma simples e sem burocracia." },
];

type Faixa = readonly [number, number];
const seg = (p: number, [a, b]: Faixa) => clamp((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// limites de cada casa (x0, y0, x1, y1) no sistema de coordenadas do símbolo
const LIM = [
  [175, 142, 517, 652],
  [341, 256, 683, 766],
  [507, 370, 848, 880],
] as const;
// área da casa do meio sem nenhum traço por cima: é por ela que a câmera "entra"
const ALVO = { x: 445, y: 518, w: 93, h: 210 };
const CASA_DOS_TRACOS = [0, 0, 1, 1, 2, 2];
const CASA_DOS_PONTOS = [0, 1];

// traços do símbolo oficial (public/brand/sisconforme-simbolo-marfim.svg), separados por casa
const TRACOS = [
  "M265 284 L175 284 L346 142 L470.5 246",
  "M218 326 L218 524 A128 128 0 0 0 346 652 L354 652",
  "M431 398 L341 398 L512 256 L636.5 360",
  "M384 440 L384 638 A128 128 0 0 0 512 766 L520 766",
  "M597 512 L507 512 L678 370 L848 512",
  "M550 554 L550 752 A128 128 0 0 0 806 752 L806 550",
];
const PONTOS = [
  [218, 326],
  [384, 440],
];

function Simbolo({ className }: { className: string }) {
  return (
    <g className={className} data-simbolo>
      {TRACOS.map((d, i) => (
        <path key={i} pathLength={1} d={d} />
      ))}
      {PONTOS.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={15} />
      ))}
    </g>
  );
}

/** Nível d'água de uma casa: retângulo com a borda de cima em onda. */
function onda(i: number, f: number, fase: number) {
  const [x0, y0, x1, y1] = LIM[i];
  const A = CONFIG.enchimento.onda * Math.sin(Math.PI * f);
  const nivel = y1 + 20 - f * (y1 - y0 + 60);
  let d = `M${x0 - 30} ${y1 + 40} L${x0 - 30} ${nivel}`;
  for (let x = x0 - 30; x <= x1 + 30; x += 12) {
    d += ` L${x} ${(nivel + A * Math.sin(x * 0.045 + fase + i * 1.7)).toFixed(1)}`;
  }
  return d + ` L${x1 + 30} ${y1 + 40} Z`;
}

export default function Hero() {
  const introRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;
    const q = <T extends Element>(sel: string) => intro.querySelector<T>(sel)!;
    const cena = q<SVGSVGElement>("[data-cena]");
    const img2 = q<SVGImageElement>("[data-img2]");
    const casa1 = q<SVGGElement>("[data-casa1]");
    const casa2 = q<SVGGElement>("[data-casa2]");
    const casa2onda = q<SVGGElement>("[data-casa2onda]");
    const casa3 = q<SVGGElement>("[data-casa3]");
    const mundos = [...intro.querySelectorAll<SVGGElement>("[data-mundo]")];
    const c2p = q<SVGPathElement>("[data-c2p]");
    const wp = [0, 1, 2].map((i) => q<SVGPathElement>(`[data-w${i + 1}]`));
    const contorno = q<SVGGElement>("[data-contorno] [data-simbolo]");
    const contTracos = [...contorno.querySelectorAll<SVGPathElement>("path")];
    const contPontos = [...contorno.querySelectorAll<SVGCircleElement>("circle")];
    const marca = q<SVGGElement>("[data-marca] [data-simbolo]");
    const marcaTracos = [...marca.querySelectorAll<SVGPathElement>("path")];
    const marcaPontos = [...marca.querySelectorAll<SVGCircleElement>("circle")];
    const veu = q<HTMLDivElement>("[data-veu]");
    const legenda = q<HTMLParagraphElement>("[data-legenda]");
    const hint = q<HTMLParagraphElement>("[data-hint]");
    const nome = q<HTMLHeadingElement>("h1");
    const frase = q<HTMLParagraphElement>("[data-frase]");
    const cta = q<HTMLAnchorElement>("[data-cta]");
    const doca = q<HTMLOListElement>("[data-doca]");
    const passos = [...doca.querySelectorAll<HTMLLIElement>("li")];
    const nums = [...doca.querySelectorAll<HTMLElement>("[data-num]")];
    const aneis = [...doca.querySelectorAll<HTMLElement>("[data-anel]")];
    const luzes = [...doca.querySelectorAll<HTMLElement>("[data-luz]")];
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Os números acendem por tempo (GSAP), uma vez, quando a faixa termina de entrar pela rolagem.
    // Depois, um brilho volta a passar por eles de tempos em tempos enquanto o hero está na tela.
    let acendeu = false;
    const brilho = emLaco(gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.4 }));
    nums.forEach((n, i) => {
      brilho
        .to(n, { keyframes: { scale: [1, 1.12, 1] }, duration: 0.5, ease: "sine.inOut" }, i * 0.35)
        .fromTo(aneis[i], { scale: 1, autoAlpha: 0.5 }, { scale: 1.9, autoAlpha: 0, duration: 0.8, ease: "power2.out" }, i * 0.35);
    });
    const acender = gsap.timeline({ paused: true, onComplete: () => brilho.play() });
    nums.forEach((n, i) => {
      const t = i * 0.5;
      acender
        .to(n, { backgroundColor: "#223F99", borderColor: "#8FA3DD", duration: 0.25 }, t)
        .to(n, { keyframes: { scale: [1, 1.22, 1] }, duration: 0.5, ease: "power2.out" }, t)
        .fromTo(aneis[i], { scale: 1, autoAlpha: 0.8 }, { scale: 2.3, autoAlpha: 0, duration: 0.9, ease: "power2.out" }, t)
        .fromTo(luzes[i], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, yoyo: true, repeat: 1 }, t);
    });
    const olho = new IntersectionObserver(([e]) => {
      if (acender.progress() === 1) (e.isIntersecting ? brilho.play() : brilho.pause());
    });
    olho.observe(intro);

    let ctaEmFoco = false;
    let W = 0, H = 0, s0 = 1, sF = 1;
    const enchido = [0, 0, 0];
    const inicio = performance.now();
    let rafEncher = 0, rafFrame = 0, pendente = false;

    const prog = () => {
      if (reduzir) return 1;
      const r = intro.getBoundingClientRect(), alcance = r.height - window.innerHeight;
      return alcance <= 0 ? 0 : clamp(-r.top / alcance);
    };

    const medir = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      cena.setAttribute("viewBox", `0 0 ${W} ${H}`);
      img2.setAttribute("width", String(W));
      img2.setAttribute("height", String(H));
      const L = CONFIG.logoInicial;
      s0 = Math.min((L.alturaTela * H) / 776, (L.larguraTela * W) / 712);
      sF = Math.max((1.2 * W) / ALVO.w, (1.2 * H) / ALVO.h);
    };

    const surgir = (el: HTMLElement, t: number, dx: number, dy: number) => {
      el.style.opacity = String(t);
      el.style.transform = `translate(${(1 - t) * dx}px, ${(1 - t) * dy}px)`;
      el.style.filter = t < 1 ? `blur(${(1 - t) * 6}px)` : "none";
    };

    const desenhar = (tr: SVGPathElement, v: number) => {
      tr.style.strokeDashoffset = String(1 - v);
      tr.style.opacity = v > 0.002 ? "1" : "0"; // esconde a ponta arredondada antes do traço começar
    };

    const frame = () => {
      const p = prog();
      const t = easeInOut(seg(p, CONFIG.mergulho));
      const s = s0 * Math.pow(sF / s0, t); // zoom exponencial: velocidade constante ao olho
      const cx = lerp(512, ALVO.x, t), cy = lerp(511, ALVO.y, t);
      const M = `matrix(${s} 0 0 ${s} ${W / 2 - cx * s} ${H / 2 - cy * s})`;
      mundos.forEach((g) => g.setAttribute("transform", M));
      c2p.setAttribute("transform", M);
      wp[1].setAttribute("transform", M);
      const cheia = t >= 0.999; // a janela já cobre a tela: tira o recorte para não sobrar borda
      if (cheia) {
        casa2.removeAttribute("clip-path");
        casa2onda.removeAttribute("clip-path");
      } else {
        casa2.setAttribute("clip-path", "url(#hb-c2)");
        casa2onda.setAttribute("clip-path", "url(#hb-w2)");
      }

      const lados = String(1 - seg(p, CONFIG.somemLados));
      casa1.style.opacity = lados;
      casa3.style.opacity = lados;
      contorno.style.opacity = String(1 - seg(p, CONFIG.someContorno));
      hint.style.opacity = String((enchido[2] >= 1 ? 1 : 0) * (1 - seg(p, [0, 0.05])));
      legenda.style.opacity = String(Math.min(enchido[2], 1 - seg(p, CONFIG.legenda)));
      veu.style.opacity = String(seg(p, CONFIG.veu));

      const m = seg(p, CONFIG.marca);
      marcaTracos.forEach((tr, k) => {
        const a = CASA_DOS_TRACOS[k] * 0.2 + (k % 2) * 0.15;
        desenhar(tr, easeInOut(seg(m, [a, a + 0.45])));
      });
      marcaPontos.forEach((pt, k) => {
        pt.style.transform = `scale(${easeOutCubic(seg(m, [0.45 + k * 0.2, 0.65 + k * 0.2]))})`;
      });

      surgir(nome, easeOutCubic(seg(p, CONFIG.nome)), -24, 0);
      surgir(frase, easeOutCubic(seg(p, CONFIG.frase)), 0, 20);
      // com foco do teclado o botão aparece na hora: escondido ele ficaria fora da ordem do Tab
      const tc = ctaEmFoco ? 1 : easeOutCubic(seg(p, CONFIG.cta));
      surgir(cta, tc, 0, 16);
      // o CSS começa com visibility:hidden (antes do JS); aqui fica só a opacidade, para seguir alcançável pelo Tab
      cta.style.visibility = "visible";
      cta.style.pointerEvents = tc < 0.02 ? "none" : "";
      cta.classList.toggle(styles.pulsa, tc >= 1);

      // faixa dos passos: sobe do rodapé e cada passo entra logo atrás do anterior
      const td = easeOutCubic(seg(p, CONFIG.doca));
      surgir(doca, td, 0, 48);
      doca.style.visibility = td < 0.02 ? "hidden" : "visible";
      passos.forEach((li, i) => {
        const [a, b] = CONFIG.doca;
        surgir(li, easeOutCubic(seg(p, [a + 0.04 + i * CONFIG.passo, b + i * CONFIG.passo])), 0, 14);
      });
      if (td >= 1 && !acendeu && !reduzir) {
        acendeu = true;
        acender.play();
      }
    };

    const agendar = () => {
      if (pendente) return;
      pendente = true;
      rafFrame = requestAnimationFrame(() => {
        pendente = false;
        frame();
      });
    };

    const encher = (agora: number) => {
      const E = CONFIG.enchimento;
      let falta = false;
      for (let i = 0; i < 3; i++) {
        const f = reduzir ? 1 : easeInOut(clamp((agora - inicio - E.atrasoMs - i * E.entreCasasMs) / E.duracaoMs));
        enchido[i] = f;
        if (f < 1) falta = true;
        wp[i].setAttribute("d", onda(i, f, agora / 380));
      }
      // o contorno de cada casa se desenha junto com o enchimento
      contTracos.forEach((tr, k) => desenhar(tr, easeInOut(clamp(enchido[CASA_DOS_TRACOS[k]] * 1.6 - (k % 2) * 0.5))));
      contPontos.forEach((pt, k) => {
        pt.style.transform = `scale(${easeOutCubic(clamp(enchido[CASA_DOS_PONTOS[k]] * 2 - 1))})`;
      });
      frame();
      if (falta) rafEncher = requestAnimationFrame(encher);
    };

    const aoRedimensionar = () => {
      medir();
      agendar();
    };

    medir();
    frame();
    rafEncher = requestAnimationFrame(encher);
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", aoRedimensionar);
    const focoNoCta = (e: FocusEvent) => {
      ctaEmFoco = e.type === "focus" && cta.matches(":focus-visible");
      frame();
    };
    cta.addEventListener("focus", focoNoCta);
    cta.addEventListener("blur", focoNoCta);

    return () => {
      cta.removeEventListener("focus", focoNoCta);
      cta.removeEventListener("blur", focoNoCta);
      olho.disconnect();
      acender.kill();
      brilho.kill();
      cancelAnimationFrame(rafEncher);
      cancelAnimationFrame(rafFrame);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", aoRedimensionar);
    };
  }, []);

  return (
    <section className={styles.intro} id="top" ref={introRef}>
      <div className={styles.stage}>
        <svg className={styles.cena} data-cena aria-hidden="true">
          <defs>
            {/* formas cheias das três casas (coordenadas do símbolo) */}
            <clipPath id="hb-c1" clipPathUnits="userSpaceOnUse">
              <path d="M175 284 L346 142 L516 284 L474 284 L474 524 A128 128 0 0 1 218 524 L218 284 Z" />
            </clipPath>
            <clipPath id="hb-c2" clipPathUnits="userSpaceOnUse">
              <path data-c2p d="M341 398 L512 256 L682 398 L640 398 L640 638 A128 128 0 0 1 384 638 L384 398 Z" />
            </clipPath>
            <clipPath id="hb-c3" clipPathUnits="userSpaceOnUse">
              <path d="M507 512 L678 370 L848 512 L806 512 L806 752 A128 128 0 0 1 550 752 L550 512 Z" />
            </clipPath>
            {/* "nível d'água" de cada casa */}
            <clipPath id="hb-w1" clipPathUnits="userSpaceOnUse"><path data-w1 /></clipPath>
            <clipPath id="hb-w2" clipPathUnits="userSpaceOnUse"><path data-w2 /></clipPath>
            <clipPath id="hb-w3" clipPathUnits="userSpaceOnUse"><path data-w3 /></clipPath>
          </defs>

          {/* casa 1: Três Caixas d'Água. A casa 2 cobre a parte de baixo/direita, então a foto é ampliada e puxada
              para as caixas caírem na parte visível */}
          <g data-mundo>
            <g data-casa1 clipPath="url(#hb-c1)">
              <g clipPath="url(#hb-w1)">
                <image href={caminho("/img/hero/hero-b-caixas.webp")} x="94" y="26" width="440" height="660" preserveAspectRatio="xMidYMid slice" />
              </g>
            </g>
          </g>

          {/* casa 2: orla e Rio Madeira. Fica no espaço da TELA para chegar à tela cheia sem perder nitidez */}
          <g data-casa2 clipPath="url(#hb-c2)">
            <g data-casa2onda clipPath="url(#hb-w2)">
              <image data-img2 href={caminho("/img/hero/hero-b-rio.webp")} x="0" y="0" width="1280" height="720" preserveAspectRatio="xMidYMid slice" />
            </g>
          </g>

          {/* casa 3: bandeira de Porto Velho + contorno do símbolo */}
          <g data-mundo>
            <g data-casa3 clipPath="url(#hb-c3)">
              <g clipPath="url(#hb-w3)">
                <image href={caminho("/img/hero/hero-b-bandeira.webp")} x="507" y="370" width="342" height="510" preserveAspectRatio="xMidYMid slice" />
              </g>
            </g>
            <g data-contorno>
              <Simbolo className={styles.contorno} />
            </g>
          </g>
        </svg>

        {/* sem JS: o pôr do sol (estado final do mergulho) como fundo fixo; com JS fica escondido */}
        <div className={styles.semJs} style={{ backgroundImage: `url(${caminho("/img/hero/hero-b-rio.webp")})` }} aria-hidden="true" />

        <div className={styles.veu} data-veu />
        <p className={styles.legenda} data-legenda>
          Porto Velho · Rondônia
        </p>

        <div className={styles.heroCopy}>
          <div className={styles.titleblock}>
            <div className={styles.lockup}>
              <svg className={styles.marca} data-marca viewBox="156 123 712 776" aria-hidden="true">
                <Simbolo className={styles.marca} />
              </svg>
              <h1>SISConforme</h1>
            </div>
            <p className={styles.frase} data-frase>
              O novo portal da Prefeitura de Porto Velho que cruza informações fiscais e ajuda você a manter a sua
              empresa em dia, de forma simples e segura.
            </p>
            <a className={styles.cta} data-cta href="#como-funciona">
              Saiba como funciona
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 2.5v11M3.5 9 8 13.5 12.5 9" />
              </svg>
            </a>
          </div>
        </div>
        <ol className={styles.doca} data-doca aria-label="Como funciona">
          {PASSOS.map((passo, i) => (
            <li key={passo.titulo} className={styles.passo}>
              <span className={styles.luz} data-luz aria-hidden="true" />
              <span className={styles.num} data-num>
                <span className={styles.anel} data-anel aria-hidden="true" />
                {i + 1}
              </span>
              <div>
                <h2>{passo.titulo}</h2>
                <p>{passo.texto}</p>
              </div>
              {i < PASSOS.length - 1 && (
                <svg className={styles.seta} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" />
                </svg>
              )}
            </li>
          ))}
        </ol>
        <p className={styles.hint} data-hint>
          Role para baixo
        </p>
      </div>
    </section>
  );
}
