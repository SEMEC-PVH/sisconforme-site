/* Motor dos vídeos da seção Segurança.
   Todo estilo sai de seek(t): nada de transição CSS, timer ou estado guardado entre quadros.
   Springs são respostas ao degrau em forma fechada; um valor que muda de alvo várias vezes
   é a soma de um spring por mudança, e assim continua sendo função pura do tempo. */

export type Mola = { w: number; z: number };

export const MOLAS: Record<string, Mola> = {
  shape: { w: 10, z: 0.9 },
  fast: { w: 16, z: 0.82 },
  slow: { w: 8, z: 0.95 },
  cursor: { w: 8, z: 1 },
  cam: { w: 5, z: 1 },
  ui: { w: 18, z: 1 },
  sai: { w: 40, z: 1 },
  press: { w: 45, z: 1 },
  ck: { w: 12, z: 1 },
  ripple: { w: 7, z: 1 },
};

export function sp(dt: number, p: Mola): number {
  if (dt <= 0) return 0;
  const { w, z } = p;
  if (z >= 1) return 1 - Math.exp(-w * dt) * (1 + w * dt);
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * dt) * (Math.cos(wd * dt) + ((z * w) / wd) * Math.sin(wd * dt));
}

/** Progresso 0→1 de um spring que começa em t0 ("jump" = degrau seco). */
export const S = (t: number, t0: number, p = "ui"): number => (p === "jump" ? (t >= t0 ? 1 : 0) : sp(t - t0, MOLAS[p]));

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export type Valor = number | number[];
export type Chave = { t: number; p?: string; pf?: Record<string, string>; set: Record<string, Valor> };
type Ponto = { t: number; v: Valor; p: string };
export type Trilha = Record<string, Ponto[]>;

export function construir(chaves: Chave[], padrao = "shape"): Trilha {
  const f: Trilha = {};
  for (const k of chaves) {
    for (const n in k.set) (f[n] ||= []).push({ t: k.t, v: k.set[n], p: k.pf?.[n] ?? k.p ?? padrao });
  }
  return f;
}

export function valor(lista: Ponto[], t: number): Valor {
  const primeiro = lista[0].v;
  if (Array.isArray(primeiro)) {
    const v = primeiro.slice();
    for (let i = 1; i < lista.length; i++) {
      const s = S(t, lista[i].t, lista[i].p);
      const a = lista[i].v as number[], b = lista[i - 1].v as number[];
      for (let j = 0; j < v.length; j++) v[j] += (a[j] - b[j]) * s;
    }
    return v;
  }
  let v = primeiro;
  for (let i = 1; i < lista.length; i++) v += ((lista[i].v as number) - (lista[i - 1].v as number)) * S(t, lista[i].t, lista[i].p);
  return v;
}

export function avaliar<T>(tr: Trilha, t: number): T {
  const o: Record<string, Valor> = {};
  for (const n in tr) o[n] = valor(tr[n], t);
  return o as T;
}

export const num = (tr: Trilha, campo: string, t: number) => valor(tr[campo], t) as number;

export const rgba = (c: number[]) =>
  `rgba(${clamp(c[0], 0, 255) | 0},${clamp(c[1], 0, 255) | 0},${clamp(c[2], 0, 255) | 0},${clamp(c[3]).toFixed(3)})`;

/** Uma forma: retângulo com raio (ou raio de cima/baixo), fundo, borda interna. */
export type Geo = {
  l: number; r: number; top: number; bot: number;
  rad?: number; rt?: number; rb?: number;
  bg: number[]; bc: number[]; bw: number;
};

export function pintar(el: HTMLElement, g: Geo, escala = 1, op = 1) {
  const w = Math.max(0, g.r - g.l), h = Math.max(0, g.bot - g.top);
  el.style.transform = `translate(${g.l.toFixed(2)}px,${g.top.toFixed(2)}px) scale(${escala.toFixed(4)})`;
  el.style.transformOrigin = `${(w / 2).toFixed(1)}px ${(h / 2).toFixed(1)}px`;
  el.style.width = `${w.toFixed(2)}px`;
  el.style.height = `${h.toFixed(2)}px`;
  const rt = clamp(g.rt ?? g.rad ?? 0, 0, h / 2), rb = clamp(g.rb ?? g.rad ?? 0, 0, h / 2);
  el.style.borderRadius = `${rt.toFixed(2)}px ${rt.toFixed(2)}px ${rb.toFixed(2)}px ${rb.toFixed(2)}px`;
  el.style.background = rgba(g.bg);
  el.style.boxShadow = `inset 0 0 0 ${Math.max(0, g.bw).toFixed(2)}px ${rgba(g.bc)}`;
  el.style.opacity = clamp(op).toFixed(3);
  el.style.visibility = op < 0.002 ? "hidden" : "visible";
}

/** Troca de conteúdo: opacidade com blur curto. */
export function fade(el: HTMLElement, o: number) {
  el.style.opacity = o.toFixed(3);
  el.style.filter = o > 0.995 ? "none" : `blur(${((1 - o) * 16).toFixed(2)}px)`;
  el.style.visibility = o < 0.002 ? "hidden" : "visible";
}

export const aperto = (t: number, tc: number) => S(t, tc, "press") - S(t, tc + 0.16, "press");
export const janela = (t: number, a: number, b: number) => clamp(S(t, a) - S(t, b));

export const BRANCO = [255, 255, 255, 1], TINTA = [20, 20, 19, 1], TINTA0 = [20, 20, 19, 0];
export const AZUL = [22, 119, 232, 1], LINHA_FINA = [222, 219, 210, 1];

/** Enquadramento fixo, igual nos quatro vídeos. */
export const ZOOM = 1.1;

export type Partes = { cam: HTMLElement; cursor: HTMLElement; ripple: HTMLElement };

/** Câmera fixa, cursor (fora da câmera, tamanho constante) e o anel que nasce no quadro do clique. */
export function cameraECursor(p: Partes, t: number, x: number, y: number, cliques: number[], seguraAperto = 0) {
  p.cam.style.transform = `translate(720px,720px) scale(${ZOOM}) translate(-720px,-720px)`;
  const sx = 720 + (x - 720) * ZOOM, sy = 720 + (y - 720) * ZOOM;
  const pr = clamp(cliques.reduce((s, c) => s + aperto(t, c), 0) + seguraAperto);
  p.cursor.style.transform = `translate(${sx.toFixed(2)}px,${sy.toFixed(2)}px) scale(${(1 - 0.2 * pr).toFixed(3)})`;
  const tc = cliques.filter((c) => t >= c && t < c + 0.9).pop();
  if (tc !== undefined) {
    const k = S(t, tc, "ripple");
    p.ripple.style.visibility = "visible";
    p.ripple.style.opacity = (0.45 * (1 - k)).toFixed(3);
    p.ripple.style.transform = `translate(${(sx + 4).toFixed(1)}px,${(sy + 3).toFixed(1)}px) scale(${(0.2 + 0.8 * k).toFixed(3)})`;
  } else p.ripple.style.visibility = "hidden";
}

/** Busca um elemento marcado com data-m dentro do palco. */
export const pegar = (raiz: HTMLElement, nome: string) => raiz.querySelector<HTMLElement>(`[data-m="${nome}"]`)!;
