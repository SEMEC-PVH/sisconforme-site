import { clamp } from "@/lib/scroll";
import { caminho } from "@/lib/caminho";

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

/** Quadros do vídeo do aperto de mãos, em public/img/aperto/{1280,2560} (f001.webp … f117.webp). */
export const QUADROS_APERTO = 117;

/** Recorte do vídeo de onde saem os quadros (largura × altura, em px). */
export const RECORTE_APERTO = { largura: 1920, altura: 764 } as const;

/** Larguras em que os quadros existem; a altura segue a proporção do recorte. */
export type LarguraAperto = 1280 | 2560;

/** Altura de um quadro na largura dada (a mesma do arquivo .webp). */
export const alturaAperto = (largura: LarguraAperto): number =>
  Math.round((largura * RECORTE_APERTO.altura) / RECORTE_APERTO.largura);

/**
 * Escolhe a resolução pelos pixels reais que as mãos ocupam (largura CSS × densidade da tela).
 * Os quadros de 2560 px só entram quando os de 1280 ficariam ampliados mais de 1,5×: trocar duas imagens
 * de 2560 px por quadro na GPU engasgava a rolagem (~5% dos quadros acima de 20 ms numa tela de 1920 px),
 * enquanto com 1280 px não houve nenhum.
 */
export const larguraAperto = (larguraCss: number, densidade: number): LarguraAperto =>
  larguraCss * densidade > 1920 ? 2560 : 1280;

/** Caminho do quadro `i` (0 = primeiro) do aperto de mãos. */
export const quadroAperto = (i: number, largura: LarguraAperto): string =>
  caminho(`/img/aperto/${largura}/f${String(i + 1).padStart(3, "0")}.webp`);

/** Onde o vídeo começa e termina, em progresso: começa logo depois de "Hoje" e fecha com "os dois.". */
const APERTO_INICIO = centro(I_HOJE) + PASSO * 0.2;
const APERTO_FIM = centro(I_FIM) + 0.04;

/** 0 = mãos fora da tela, 1 = aperto de mãos completo. Escolhe o quadro do vídeo. */
export const progressoAperto = (p: number): number => clamp((p - APERTO_INICIO) / (APERTO_FIM - APERTO_INICIO));

/**
 * Quanto a imagem muda de um quadro para o seguinte (diferença média por pixel, 0–255), medido nos .webp.
 * A aproximação é quase uniforme (1 a 6 por quadro). O balanço, depois do encaixe, saltava até 16 por quadro a 24 qps;
 * por isso ele vem de design/video/aperto-de-maos-v2-site.mp4, com quadros intermediários interpolados a 48 qps.
 */
const MOVIMENTO_APERTO = [
  1.2, 1.3, 1.6, 1.7, 1.7, 1.9, 1.8, 1.9, 1.9, 2.2, 2.3, 2.7, 2.9, 3.1, 3.4, 3.6, 3.7, 3.8, 3.9, 4.1, 4.3, 4.3, 4.5,
  4.7, 4.6, 4.9, 4.9, 5.1, 5.1, 5.2, 5.3, 5.4, 5.3, 5.5, 5.4, 5.7, 5.6, 5.7, 5.8, 5.8, 5.8, 5.7, 5.7, 5.9, 5.7, 5.4,
  5.4, 5.2, 5.1, 5.1, 5, 5.2, 5, 4.9, 5, 5.1, 5.2, 5.3, 5.3, 4.8, 5.8, 6.1, 5.8, 5.3, 4.8, 3.9, 3.7, 3.6, 3.8, 4.1,
  4.2, 4.5, 2.9, 2.9, 3.2, 3.2, 3.8, 3.9, 4.8, 4.9, 5.9, 5.9, 7, 7, 7.7, 7.9, 8.4, 8.4, 8.2, 8.4, 8, 8, 6.8, 7, 7.6,
  8, 2, 1.9, 4.8, 4.8, 6.9, 6.6, 8.4, 8.3, 9.3, 9.3, 9.4, 9.5, 9.2, 9.1, 8.2, 8.2, 6.5, 6.6, 4.5, 4.5,
] as const;

/** Piso de rolagem por quadro: mesmo os quadros parados ganham um pouco, senão o começo some de vez. */
const MOVIMENTO_MINIMO = 3;

/**
 * Quadro em que as mãos terminam de se encaixar. Daí em diante o vídeo é o balanço do aperto: as mãos sobem e
 * descem rápido, com saltos grandes entre quadros, e conduzido pela rolagem isso parecia travado (cada passo da
 * roda pulava entre "em cima" e "embaixo"). Por isso a rolagem conduz só a aproximação; o balanço toca no tempo.
 */
export const QUADRO_ENCAIXE = 72;

/** Velocidade do balanço, que toca sozinho depois do encaixe (quadros interpolados a 48 qps). */
export const QUADROS_POR_SEGUNDO = 48;

/** Rolagem acumulada até cada quadro da aproximação, de 0 (primeiro) a 1 (encaixe), proporcional ao movimento. */
const MARCOS_APERTO: readonly number[] = (() => {
  const pesos = MOVIMENTO_APERTO.slice(0, QUADRO_ENCAIXE).map((m) => m + MOVIMENTO_MINIMO);
  const total = pesos.reduce((s, m) => s + m, 0);
  let soma = 0;
  return [0, ...pesos.map((m) => (soma += m) / total)];
})();

/**
 * Quadro (fracionário) da aproximação para o progresso `t` (0–1): vai do primeiro quadro ao encaixe. Cada quadro
 * recebe uma fatia de rolagem proporcional ao quanto ele muda, então a mesma rolagem dá sempre o mesmo movimento.
 */
export function quadroDoAperto(t: number): number {
  const v = clamp(t);
  let i = 0;
  while (i < MARCOS_APERTO.length - 2 && MARCOS_APERTO[i + 1] <= v) i++;
  const a = MARCOS_APERTO[i];
  const b = MARCOS_APERTO[i + 1];
  return Math.min(QUADRO_ENCAIXE, i + (v - a) / (b - a));
}

/** Parte do balanço (em tempo) a partir da qual ele freia até parar no último quadro. */
const INICIO_FREIO = 0.6;
/** Velocidade da parte constante, relativa à média: com o freio linear, 0,6·v + 0,4·v/2 = 1. */
const VELOCIDADE_BALANCO = 1 / (INICIO_FREIO + (1 - INICIO_FREIO) / 2);

/**
 * Quadro do balanço para `b` de 0 (encaixe) a 1 (último quadro), em tempo. O vídeo termina com as mãos ainda em
 * movimento; parar ali de uma vez parecia um tranco. Então o balanço corre no ritmo do vídeo e, nos últimos 40%
 * do tempo, desacelera até parar. Na parte constante o quadro é inteiro, como num vídeo (misturar vizinhos com
 * os saltos grandes do balanço deixava contorno duplo); no freio os saltos são pequenos e a posição é
 * fracionária, senão cada quadro ficaria parado várias atualizações e a frenagem andaria aos degraus.
 */
export function quadroDoBalanco(b: number): number {
  const t = clamp(b);
  const resto = t - INICIO_FREIO;
  const s =
    resto <= 0
      ? VELOCIDADE_BALANCO * t
      : VELOCIDADE_BALANCO * (INICIO_FREIO + resto - (resto * resto) / (2 * (1 - INICIO_FREIO)));
  const pos = QUADRO_ENCAIXE + Math.min(1, s) * (QUADROS_APERTO - 1 - QUADRO_ENCAIXE);
  return resto <= 0 ? Math.floor(pos + 1e-6) : pos;
}

/** Duração do balanço, em segundos: a parte constante toca no ritmo do vídeo; o freio alonga o final. */
export const DURACAO_BALANCO =
  (VELOCIDADE_BALANCO * (QUADROS_APERTO - 1 - QUADRO_ENCAIXE)) / QUADROS_POR_SEGUNDO;

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
