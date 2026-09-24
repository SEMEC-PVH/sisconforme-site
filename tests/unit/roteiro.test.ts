import { describe, expect, it } from "vitest";
import { JANELAS, LEGENDAS, ROTEIRO_ACESSIVEL, expressaoEm, legendaEm } from "@/components/historia/roteiro";

describe("roteiro da Dona Ana", () => {
  it("tem 7 cenas com legenda e janela", () => {
    expect(LEGENDAS).toHaveLength(7);
    expect(JANELAS).toHaveLength(7);
    expect(ROTEIRO_ACESSIVEL).toHaveLength(7);
    expect(LEGENDAS[0]).toMatchObject({ kicker: "Como funciona", titulo: "Esta é a Dona Ana." });
    expect(LEGENDAS[6].cta).toBe(true);
  });

  it("expressões seguem o scroll", () => {
    expect(expressaoEm(0)).toBe("neutra");
    expect(expressaoEm(0.2)).toBe("confusa");
    expect(expressaoEm(0.35)).toBe("neutra");
    expect(expressaoEm(0.5)).toBe("preocupada");
    expect(expressaoEm(0.65)).toBe("neutra");
    expect(expressaoEm(0.9)).toBe("aliviada");
    expect(expressaoEm(1)).toBe("aliviada");
  });

  it("primeira legenda já visível no início; última nunca some", () => {
    expect(legendaEm(0, 0).opacidade).toBe(1);
    expect(legendaEm(1, 0).opacidade).toBe(0);
    expect(legendaEm(6, 1).opacidade).toBe(1);
  });

  it("legenda some depois da sua janela", () => {
    expect(legendaEm(0, 0.2).opacidade).toBe(0);
    expect(legendaEm(3, 0.5).opacidade).toBe(1);
  });
});
