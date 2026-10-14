import { expect, test, type Page } from "@playwright/test";

// The explorable maps: open a map, open a node, climb back, search, solve a challenge.

async function openNode(page: Page, name: string) {
  await page.getByRole("button", { name: new RegExp(`^${name},`) }).click();
}

test.describe("explorable maps", () => {
  test("the index lists every map and the lab", async ({ page }) => {
    await page.goto("/en/explore");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const id of ["atlas", "pipeline", "cloud", "soc", "webapp", "net", "agents"]) {
      await expect(page.locator(`a[href="/en/explore/${id}"]`)).toBeVisible();
    }
    await expect(page.locator('a[href="/en/lab"]').first()).toBeVisible();
  });

  test("a node opens a side panel and the back button climbs one level", async ({ page }) => {
    await page.goto("/en/explore/atlas");
    await openNode(page, "Public API");
    await expect(page).toHaveURL(/#a-api$/);
    await openNode(page, "Fetch a map");
    await expect(page).toHaveURL(/#a-api-idor$/);
    const panel = page.getByRole("complementary", { name: "Fetch a map" });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: "try it in the lab" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/#a-api$/);
  });

  test("a deep link opens the node and its branch", async ({ page }) => {
    await page.goto("/en/explore/atlas#a-iam");
    await expect(page.getByRole("complementary", { name: "The API's cloud role" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Cloud account,/ })).toBeVisible();
  });

  test("a challenge is solved by selecting the risky lines", async ({ page }) => {
    await page.goto("/en/explore/atlas#a-api-idor");
    const panel = page.getByRole("complementary", { name: "Fetch a map" });
    await panel.getByRole("button", { name: /^Line 2:/ }).click();
    await panel.getByRole("button", { name: "check my answer" }).click();
    await expect(panel.getByText("Correct.")).toBeVisible();
  });

  test("search flies to a node", async ({ page }) => {
    await page.goto("/en/explore/cloud");
    await page.getByRole("searchbox", { name: "Search this map" }).fill("bucket");
    await page.getByRole("button", { name: "Object storage" }).click();
    await expect(page).toHaveURL(/#c-buckets$/);
  });

  test("a mission points at the next stop", async ({ page }) => {
    await page.goto("/en/explore/atlas");
    await page.getByRole("button", { name: "start" }).first().click();
    await expect(page.getByText(/Mission:/)).toBeVisible();
    await expect(page.getByRole("button", { name: /take me there/ })).toBeVisible();
  });

  test("other languages are translated", async ({ page }) => {
    await page.goto("/pt/explore/net");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Uma mensagem descendo a pilha");
    await page.goto("/es/lab");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rómpelo, arréglalo, demuéstralo");
  });

  test("topic pages link back to the map", async ({ page }) => {
    await page.goto("/en/appsec/topic/sast");
    await expect(page.locator('a[href^="/en/explore/pipeline#"]').first()).toBeVisible();
  });
});

test.describe("small screens", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("the map starts as a list and does not overflow", async ({ page }) => {
    await page.goto("/en/explore/agents");
    await expect(page.getByRole("button", { name: "View as a map" })).toBeVisible();
    await page.getByRole("button", { name: /^Tools and actions: / }).click();
    await page.getByRole("button", { name: /^Tool permissions/ }).click();
    await expect(page).toHaveURL(/#g-tool-perms$/);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
