import { describe, expect, it } from "vitest";
import { clamp, easeInCubic, easeInOutQuad, easeOutBack, easeOutCubic, seg } from "@/lib/scroll";

describe("clamp", () => {
  it("limita ao intervalo padrão 0–1", () => {
    expect(clamp(-2)).toBe(0);
    expect(clamp(0.4)).toBe(0.4);
    expect(clamp(3)).toBe(1);
  });
  it("aceita limites próprios", () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe("seg", () => {
  it("mapeia p dentro de [a,b] para 0–1", () => {
    expect(seg(0.1, 0.1, 0.3)).toBe(0);
    expect(seg(0.2, 0.1, 0.3)).toBeCloseTo(0.5);
    expect(seg(0.5, 0.1, 0.3)).toBe(1);
  });
});

describe("easings", () => {
  it("começam em 0 e terminam em 1", () => {
    for (const f of [easeOutCubic, easeInOutQuad, easeInCubic, easeOutBack]) {
      expect(f(0)).toBeCloseTo(0);
      expect(f(1)).toBeCloseTo(1);
    }
  });
  it("easeOutBack passa de 1 antes de assentar (overshoot)", () => {
    expect(easeOutBack(0.7)).toBeGreaterThan(1);
  });
  it("easeOutBack é 0 para t negativo", () => {
    expect(easeOutBack(-0.5)).toBe(0);
  });
  it("easeInOutQuad é simétrico", () => {
    expect(easeInOutQuad(0.5)).toBeCloseTo(0.5);
  });
});
