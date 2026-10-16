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
  quadroDoAperto,
  quadroDoBalanco,
  QUADRO_ENCAIXE,
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

  it("a rolagem leva do primeiro quadro ao encaixe, sempre avançando, proporcional ao movimento", () => {
    expect(quadroDoAperto(0)).toBe(0);
    expect(quadroDoAperto(1)).toBe(QUADRO_ENCAIXE);
    let anterior = -1;
    for (let t = 0; t <= 1; t += 0.001) {
      const q = quadroDoAperto(t);
      expect(q).toBeGreaterThanOrEqual(anterior);
      anterior = q;
    }
    // a aproximação é quase uniforme: metade da rolagem fica perto do meio do caminho até o encaixe
    expect(quadroDoAperto(0.5)).toBeGreaterThan(QUADRO_ENCAIXE * 0.35);
    expect(quadroDoAperto(0.5)).toBeLessThan(QUADRO_ENCAIXE);
  });

  it("o balanço vai do encaixe ao último quadro, em quadros inteiros, e freia no fim sem parar de avançar", () => {
    expect(quadroDoBalanco(0)).toBe(QUADRO_ENCAIXE);
    expect(quadroDoBalanco(1)).toBeCloseTo(QUADROS_APERTO - 1, 6);
    for (let b = 0; b <= 0.6; b += 0.01) expect(Number.isInteger(quadroDoBalanco(b))).toBe(true);
    const passo = (b: number) => quadroDoBalanco(b + 0.01) - quadroDoBalanco(b);
    // no freio cada passo é menor que o anterior, mas continua avançando
    for (let b = 0.62; b < 0.98; b += 0.01) {
      expect(passo(b)).toBeGreaterThan(0);
      expect(passo(b)).toBeLessThan(passo(b - 0.01) + 1e-9);
    }
    expect(passo(0.985)).toBeLessThan(passo(0.3) * 0.15);
  });

  it("os quadros do aperto seguem a numeração dos arquivos", () => {
    expect(quadroAperto(0, 1280)).toBe("/img/aperto/1280/f001.webp");
    expect(quadroAperto(QUADROS_APERTO - 1, 2560)).toBe("/img/aperto/2560/f117.webp");
  });

  it("a altura dos quadros segue a proporção do vídeo (1920 × 764)", () => {
    expect(alturaAperto(2560)).toBe(1019);
    expect(alturaAperto(1280)).toBe(509);
  });

  it("só telas que ampliariam os quadros de 1280 px mais de 1,5× recebem os de 2560 px", () => {
    expect(larguraAperto(390 * 1.04, 3)).toBe(1280); // celular 3x: ~1217 px reais
    expect(larguraAperto(1200, 1)).toBe(1280);
    expect(larguraAperto(1584, 1)).toBe(1280); // monitor de 1920 px
    expect(larguraAperto(1400, 1.25)).toBe(1280); // 1750 px reais
    expect(larguraAperto(1997, 1)).toBe(2560);
    expect(larguraAperto(1440, 2)).toBe(2560); // notebook retina
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
