import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Automated accessibility checks (WCAG 2.1 A and AA) on the pages that matter most,
// in both themes. Automation catches a part of the problems: it complements, not
// replaces, a manual pass.

const PAGES = ["/en", "/en/explore", "/en/explore/atlas#a-ci", "/en/explore/cloud", "/en/lab#ci", "/en/lab#tabletop", "/pt/explore/net", "/es/lab#idor"];

async function violations(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return result.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
}

for (const theme of ["dark", "light"] as const) {
  test.describe(`axe, ${theme} theme`, () => {
    for (const path of PAGES) {
      test(path, async ({ page }) => {
        await page.goto(path);
        await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
        await page.waitForTimeout(1500);
        expect(await violations(page)).toEqual([]);
      });
    }
  });
}
