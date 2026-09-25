import { clamp } from "@/lib/scroll";

/**
 * Roteiro da seção "Uma nova relação": frases que sobem com a rolagem enquanto a seção
 * fica fixa na tela. Tudo aqui é função pura do progresso `p` (0 no topo da seção, 1 no fim).
 */
export interface Frase {
  /** Cada item vira uma linha própria. */
  linhas: readonly string[];
}

export const TITULO = "Uma nova relação";

export const FRASES: readonly Frase[] = [
  { linhas: ["Antes,"] },
  { linhas: ["o Fisco", "via primeiro."] },
  { linhas: ["Depois,"] },
  { linhas: ["a empresa", "descobria tarde."] },
  { linhas: ["Hoje"] },
  { linhas: ["o SISConforme une"] },
  { linhas: ["os dois."] },
];

export const LEGENDA = "Fisco e contribuinte diante dos mesmos dados";

/** Texto corrido para leitores de tela (as letras animadas ficam ocultas para eles). */
export const TEXTO_CORRIDO = [TITULO + ".", ...FRASES.map((f) => f.linhas.join(" ")), LEGENDA + "."].join(" ");

/** Frase em que o fundo passa de escuro para claro. */
export const I_HOJE = 4;
/** Frase em que as mãos do auditor e da empresa se aproximam. */
export const I_UNE = 5;
/** Última frase: fica no centro e recebe o gradiente. */
export const I_FIM = FRASES.length - 1;

/** Progresso em que a primeira frase está no centro. */
export const INICIO = 0.06;
/** Distância, em progresso, entre os centros de duas frases. */
export const PASSO = 0.115;
/** Quanto a frase desacelera ao passar pelo centro (0 = velocidade constante, <1). */
export const FREIO = 0.85;

const suave = (t: number): number => t * t * (3 - 2 * t);

export const centro = (k: number): number => INICIO + k * PASSO;

/**
 * Distância da frase `k` até o centro da tela, em "frases":
 * positivo = ainda abaixo, 0 = no centro, negativo = já passou. A última nunca passa.
 */
export function deslocamento(k: number, p: number): number {
  const x = (centro(k) - p) / PASSO;
  return k === I_FIM ? Math.max(x, 0) : x;
}

/** Curva do movimento: anda devagar perto de x inteiro (a frase "para" no centro). */
export const curva = (x: number): number => x - (FREIO * Math.sin(2 * Math.PI * x)) / (2 * Math.PI);

/** Opacidade da frase a partir do deslocamento. */
export const visibilidade = (x: number): number => clamp(1.25 - Math.abs(x) * 1.1);

/** 0 = fundo escuro, 1 = fundo claro. Vira na chegada de "Hoje". */
export const claridade = (p: number): number => suave(clamp(0.9 - deslocamento(I_HOJE, p) * 1.4));

/** Quadros do vídeo do aperto de mãos, em public/img/aperto/{1280,2560} (f001.webp … f120.webp). */
export const QUADROS_APERTO = 120;

/** Larguras em que os quadros existem; a altura segue a proporção 1280 × 387. */
export type LarguraAperto = 1280 | 2560;

/** Escolhe a resolução pelos pixels reais que as mãos ocupam (largura CSS × densidade da tela). */
export const larguraAperto = (larguraCss: number, densidade: number): LarguraAperto =>
  larguraCss * densidade > 1400 ? 2560 : 1280;

/** Caminho do quadro `i` (0 = primeiro) do aperto de mãos. */
export const quadroAperto = (i: number, largura: LarguraAperto): string =>
  `/img/aperto/${largura}/f${String(i + 1).padStart(3, "0")}.webp`;

/** Onde o vídeo começa e termina, em progresso: começa logo depois de "Hoje" e fecha com "os dois.". */
const APERTO_INICIO = centro(I_HOJE) + PASSO * 0.2;
const APERTO_FIM = centro(I_FIM) + 0.04;

/** 0 = mãos fora da tela, 1 = aperto de mãos completo. Escolhe o quadro do vídeo. */
export const progressoAperto = (p: number): number => clamp((p - APERTO_INICIO) / (APERTO_FIM - APERTO_INICIO));

/** Opacidade das mãos: aparecem logo no começo do vídeo. */
export const presencaMaos = (p: number): number => suave(clamp((p - APERTO_INICIO) / (PASSO * 0.35)));

/** 0 = cartões separados, 1 = gradiente em tela cheia. */
export const fusao = (p: number): number => suave(clamp((p - (centro(I_UNE) + PASSO * 0.25)) / (PASSO * 0.9)));

/** 0 = "os dois." preenchido, 1 = só o contorno (e a legenda visível). */
export const contorno = (p: number): number => suave(clamp((p - (centro(I_FIM) + 0.05)) / 0.06));

/** Índice da frase mais próxima do centro. */
export function fraseAtiva(p: number): number {
  let melhor = 0;
  FRASES.forEach((_, k) => {
    if (Math.abs(deslocamento(k, p)) < Math.abs(deslocamento(melhor, p))) melhor = k;
  });
  return melhor;
}

/** Deslocamento vertical (px) e rotação (graus) da letra `i` na onda. */
export function onda(i: number, amplitude: number, fase: number): { y: number; r: number } {
  return {
    y: Math.sin(i * 0.95 + fase) * amplitude,
    r: Math.cos(i * 1.3 + fase) * amplitude * 0.09,
  };
}
