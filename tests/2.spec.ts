import { test, expect } from "@playwright/test";

test.describe("Module 2", () => {
	test(`1. active link in navbar implemented`, async ({ page }) => {
		await page.goto("/");

		const nav = page.getByRole("navigation").first();
		await nav.waitFor();
		expect(await nav.getByRole("link", { name: "Home" }).count()).toBeGreaterThan(0);
		expect(await nav.getByRole("link", { name: "All" }).count()).toBeGreaterThan(0);

		const activeLinkBorderBottomColor = await nav
			.getByRole("link", { name: "Home" })
			.evaluate((e) => window.getComputedStyle(e).borderBottomColor);
		const inactiveLinkBorderBottomColor = await nav
			.getByRole("link", { name: "All" })
			.evaluate((e) => window.getComputedStyle(e).borderBottomColor);

		expect(activeLinkBorderBottomColor).not.toBe(inactiveLinkBorderBottomColor);

		await page.goto("/products");

		await expect(nav.getByRole("link", { name: "Home" })).toHaveCSS(
			"border-bottom-color",
			inactiveLinkBorderBottomColor,
		);
		await expect(nav.getByRole("link", { name: "All" })).toHaveCSS(
			"border-bottom-color",
			activeLinkBorderBottomColor,
		);
	});

	test(`2.`, () => {
		/** Nothing to do here */
	});

	test(`3.`, () => {
		/** Nothing to do here */
	});

	test(`4.`, () => {
		/** Nothing to do here */
	});

	test(`5. products list API implemented`, async ({ page }) => {
		await page.goto("/products");

		const list = page.getByTestId("products-list");
		const productListItems = list.locator("li");
		await productListItems.first().waitFor();
		expect(await productListItems.count()).toBeGreaterThan(0);
	});

	test(`6. single product page implemented`, async ({ page }) => {
		await page.goto(`/products`);
		const list = page.getByTestId("products-list");
		const productLink = list.locator("li a");
		await productLink.first().waitFor();
		const count = await productLink.count();
		expect(count).toBeGreaterThan(0);
		const randomProductLink = productLink.nth(Math.floor(Math.random() * count));
		await randomProductLink.click();
		await page.waitForURL("**/product/**");

		const title = await page.locator("h1").textContent();
		expect(await page.title()).toContain(title);
	});

	test(`7. single product SEO`, async ({ page }) => {
		await page.goto(`/products`);
		const list = page.getByTestId("products-list");
		const productLink = list.locator("li a");
		await productLink.first().waitFor();
		const count = await productLink.count();
		expect(count).toBeGreaterThan(0);
		const randomProductLink = productLink.nth(Math.floor(Math.random() * count));
		await randomProductLink.click();
		await page.waitForURL("**/product/**");

		const metaDescription = page.locator('meta[name="description"]');
		const description = await metaDescription.getAttribute("content");
		expect(description).toBeTruthy();

		const text = await page.textContent("body");
		expect(text).toContain(description);
	});

	test(`8. pagination`, async ({ page }) => {
		await page.goto(`/products`);

		const paginationLinks = page.getByLabel(/pagination/i).getByRole("link");
		await paginationLinks.first().waitFor();
		const count = await paginationLinks.count();
		expect(count).toBeGreaterThan(0);

		const randomPageLink = paginationLinks.nth(Math.floor(Math.random() * count));
		await randomPageLink.click();
		await page.waitForURL("**/products/**");

		const list = page.getByTestId("products-list");
		const productListItems = list.locator("li");
		await productListItems.first().waitFor();
		expect(await productListItems.count()).toBeGreaterThan(0);
	});

	test(`9.`, () => {
		/** Nothing to do here */
	});
});
