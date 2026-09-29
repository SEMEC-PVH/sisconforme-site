import { describe, expect, it } from "vitest";
import {
  centro,
  claridade,
  contorno,
  curva,
  deslocamento,
  FRASES,
  fraseAtiva,
  fusao,
  I_FIM,
  I_HOJE,
  I_UNE,
  onda,
  PASSO,
  presencaMaos,
  progressoAperto,
  QUADROS_APERTO,
  alturaAperto,
  larguraAperto,
  quadroAperto,
  visibilidade,
} from "@/components/trajetoria/roteiro";

describe("roteiro da trajetória", () => {
  it("todas as frases cabem na rolagem, com folga no fim", () => {
    expect(centro(0)).toBeGreaterThan(0);
    expect(centro(I_FIM)).toBeLessThan(0.85);
  });

  it("cada frase está no centro no seu momento", () => {
    FRASES.forEach((_, k) => {
      expect(deslocamento(k, centro(k))).toBeCloseTo(0);
      expect(fraseAtiva(centro(k))).toBe(k);
    });
  });

  it("a última frase para no centro e não sai mais", () => {
    expect(deslocamento(I_FIM, 1)).toBe(0);
    expect(visibilidade(deslocamento(I_FIM, 1))).toBe(1);
  });

  it("a curva passa pelas posições inteiras e freia no centro", () => {
    expect(curva(0)).toBeCloseTo(0);
    expect(curva(1)).toBeCloseTo(1);
    expect(curva(-1)).toBeCloseTo(-1);
    const perto = (curva(0.05) - curva(0)) / 0.05;
    const longe = (curva(0.55) - curva(0.5)) / 0.05;
    expect(perto).toBeLessThan(longe);
  });

  it("frases distantes somem", () => {
    expect(visibilidade(0)).toBe(1);
    expect(visibilidade(2)).toBe(0);
  });

  it("o fundo clareia só a partir de \"Hoje\"", () => {
    expect(claridade(0)).toBe(0);
    expect(claridade(centro(I_HOJE) - PASSO)).toBe(0);
    expect(claridade(centro(I_HOJE))).toBeGreaterThan(0.5);
    expect(claridade(centro(I_UNE))).toBe(1);
  });

  it("as mãos entram depois de \"Hoje\" e o aperto fecha com \"os dois.\"", () => {
    expect(presencaMaos(centro(I_HOJE))).toBe(0);
    expect(progressoAperto(centro(I_HOJE))).toBe(0);
    expect(presencaMaos(centro(I_UNE))).toBe(1);
    expect(progressoAperto(centro(I_UNE))).toBeGreaterThan(0);
    expect(progressoAperto(centro(I_UNE))).toBeLessThan(1);
    expect(progressoAperto(1)).toBe(1);
    expect(fusao(centro(I_UNE))).toBe(0);
    expect(fusao(centro(I_FIM) + 0.03)).toBe(1);
  });

  it("os quadros do aperto seguem a numeração dos arquivos", () => {
    expect(quadroAperto(0, 1280)).toBe("/img/aperto/1280/f001.webp");
    expect(quadroAperto(QUADROS_APERTO - 1, 2560)).toBe("/img/aperto/2560/f071.webp");
  });

  it("a altura dos quadros segue a proporção do vídeo (2944 × 1172)", () => {
    expect(alturaAperto(2560)).toBe(1019);
    expect(alturaAperto(1280)).toBe(510);
  });

  it("telas grandes ou de alta densidade recebem os quadros em 2560 px", () => {
    expect(larguraAperto(390 * 1.04, 3)).toBe(1280); // celular 3x: ~1217 px reais
    expect(larguraAperto(1200, 1)).toBe(1280);
    expect(larguraAperto(1997, 1)).toBe(2560); // 1920 px a 104vw
    expect(larguraAperto(1400, 1.25)).toBe(2560);
  });

  it("o contorno vem depois da fusão", () => {
    expect(contorno(centro(I_FIM))).toBe(0);
    expect(contorno(1)).toBe(1);
  });

  it("a onda some com amplitude zero", () => {
    const { y, r } = onda(3, 0, 1.2);
    expect(Math.abs(y)).toBe(0);
    expect(Math.abs(r)).toBe(0);
  });
});
