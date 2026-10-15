import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const URL = process.env.A11Y_URL ?? "http://localhost:4173/";

/** Rola a página inteira devagar, para as seções que se revelam ao rolar ficarem no estado final. */
async function rolarTudo(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    // volta ao topo e espera as entradas terminarem: o axe mediria o contraste de um texto no meio do fade
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 1500));
  });
}

const CASOS = [
  ["inicial desktop", "", { width: 1440, height: 900 }, false],
  ["inicial celular", "", { width: 390, height: 844 }, false],
  ["inicial alto contraste", "", { width: 1440, height: 900 }, true],
  ["acessibilidade desktop", "acessibilidade", { width: 1440, height: 900 }, false],
  ["acessibilidade celular", "acessibilidade", { width: 390, height: 844 }, false],
] as const;

for (const [nome, caminho, viewport, contraste] of CASOS) {
  test(`axe WCAG 2.1 AA (${nome})`, async ({ page }) => {
    await page.setViewportSize(viewport);
    if (contraste) await page.addInitScript(() => localStorage.setItem("a11y-contraste", "1"));
    await page.goto(URL + caminho);
    await rolarTudo(page);
    const r = await new AxeBuilder({ page }).exclude("[vw]").exclude("#vlibras-access-wrapper").exclude("#vlibras-popup") /* VLibras: widget do governo federal, fora do nosso controle */.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
    const resumo = r.violations.map((v) => ({
      id: v.id,
      impacto: v.impact,
      ajuda: v.help,
      ocorrencias: v.nodes.length,
      exemplos: v.nodes.slice(0, 4).map((n) => `${n.target.join(" ")} :: ${n.failureSummary?.split("\n").slice(1, 2).join("")}`),
    }));
    console.log(`\n### ${nome}\n` + JSON.stringify(resumo, null, 1));
    expect(r.violations.filter((v) => v.impact === "critical" || v.impact === "serious")).toEqual([]);
  });
}
