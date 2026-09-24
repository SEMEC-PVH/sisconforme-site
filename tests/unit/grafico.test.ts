import { describe, expect, it } from "vitest";
import { DADOS_GRAFICO, escalaY } from "@/components/GraficoAbas";

describe("gráfico", () => {
  it("tem as duas abas do original", () => {
    expect(DADOS_GRAFICO.a.title).toBe("Divergências por competência");
    expect(DADOS_GRAFICO.b.title).toBe("Regularização após o alerta");
    expect(DADOS_GRAFICO.a.series.map((s) => s.n)).toEqual(["Cartão × NFS-e", "NFS-e × PGDAS", "Cartão × PGDAS"]);
  });
  it("escalaY usa a mesma geometria do original (T=16, altura útil 296)", () => {
    expect(escalaY(0, 500)).toBe(312);
    expect(escalaY(500, 500)).toBe(16);
    expect(escalaY(250, 500)).toBe(164);
  });
});
