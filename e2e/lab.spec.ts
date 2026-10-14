import { expect, test, type Page } from "@playwright/test";

// The Atlas lab: break it, fix it, prove it, for every kind of exercise.

const send = (page: Page) => page.getByRole("button", { name: "send request" }).click();

test.describe("atlas lab", () => {
  test("idor: read someone else's map, fix it, prove it", async ({ page }) => {
    await page.goto("/en/lab#idor");
    await page.getByLabel("Map id").fill("4");
    await send(page);
    await expect(page.getByText("It worked: you got something you should not have.")).toBeVisible();
    await page.getByRole("button", { name: "apply the fix" }).click();
    await send(page);
    await expect(page.getByText("Blocked: the same attack no longer works.")).toBeVisible();
  });

  test("the fix stays locked until the flaw was exploited", async ({ page }) => {
    await page.goto("/en/lab#sqli");
    await expect(page.getByRole("button", { name: "apply the fix" })).toBeDisabled();
  });

  test("sqli: the generated SQL is shown and the payload is blocked after the fix", async ({ page }) => {
    await page.goto("/en/lab#sqli");
    await page.getByLabel("Search text").fill("%' OR '1'='1");
    await send(page);
    await expect(page.getByText("SQL the server built")).toBeVisible();
    await expect(page.getByText("It worked: you got something you should not have.")).toBeVisible();
    await page.getByRole("button", { name: "apply the fix" }).click();
    await send(page);
    await expect(page.getByText("Blocked: the same attack no longer works.")).toBeVisible();
  });

  test("xss: a script payload runs, then is shown as text", async ({ page }) => {
    await page.goto("/en/lab#xss");
    await page.getByLabel("Map name").fill("<img src=x onerror=alert(1)>");
    await send(page);
    await expect(page.getByText(/Script ran in the agent's browser/)).toBeVisible();
    await page.getByRole("button", { name: "apply the fix" }).click();
    await send(page);
    await expect(page.getByText("Blocked: the same attack no longer works.")).toBeVisible();
  });

  test("ci: the safe settings block every attack and keep the work running", async ({ page }) => {
    await page.goto("/en/lab#ci");
    await page.getByRole("button", { name: "run the attacks" }).click();
    await expect(page.getByText("attack succeeds").first()).toBeVisible();
    for (const group of ["ci-trigger", "ci-perms", "ci-checkout", "ci-title", "ci-action"]) {
      await page.locator(`input[name="${group}"]`).nth(group === "ci-title" || group === "ci-action" ? 1 : 1).check();
    }
    await page.getByRole("button", { name: "run the attacks" }).click();
    await expect(page.getByText("All attacks blocked, and the team's work still runs.")).toBeVisible();
  });

  test("ci: over-restricting breaks the team's work", async ({ page }) => {
    await page.goto("/en/lab#ci");
    await page.locator('input[name="ci-trigger"]').nth(2).check();
    await page.getByRole("button", { name: "run the attacks" }).click();
    await expect(page.getByText("broken by your change").first()).toBeVisible();
  });

  test("iam and bucket are solvable", async ({ page }) => {
    await page.goto("/en/lab#iam");
    for (const g of ["iam-tiles", "iam-secrets", "iam-passrole"]) await page.locator(`input[name="${g}"]`).nth(1).check();
    await page.getByRole("button", { name: "run the attacks" }).click();
    await expect(page.getByText("All attacks blocked, and the team's work still runs.")).toBeVisible();

    await page.goto("/en/lab#bucket");
    for (const g of ["bucket-principal", "bucket-action"]) await page.locator(`input[name="${g}"]`).nth(1).check();
    await page.getByRole("button", { name: "run the attacks" }).click();
    await expect(page.getByText("All attacks blocked, and the team's work still runs.")).toBeVisible();
  });

  test("tabletop: the best answers pass the incident", async ({ page }) => {
    await page.goto("/en/lab#tabletop");
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: /^(Revoke|Export|Rotate every|Query the access|Enable push)/ }).first().click();
      await page.getByRole("button", { name: /next decision|see the debrief/ }).click();
    }
    await expect(page.getByText(/You contained it quickly/)).toBeVisible();
  });

  test("progress is remembered and shown on the home page", async ({ page }) => {
    await page.goto("/en/lab#iam");
    for (const g of ["iam-tiles", "iam-secrets", "iam-passrole"]) await page.locator(`input[name="${g}"]`).nth(1).check();
    await page.getByRole("button", { name: "run the attacks" }).click();
    await page.goto("/en");
    await expect(page.getByText(/1 of 7 lab exercises solved/)).toBeVisible();
  });
});
