import { test, expect } from "@playwright/test";
import { openRandomProductPage } from "./utils";

test.describe("Module 2", () => {
	test(`1. active link in navbar implemented`, async ({ page }) => {
		await page.goto("/");

		const nav = page.getByRole("navigation").first();
		await nav.waitFor();
		expect(await nav.getByRole("link", { name: "Home" }).count()).toBeGreaterThan(0);
		expect(await nav.getByRole("link", { name: "All" }).count()).toBeGreaterThan(0);

		const activeLinkBefore = await nav.locator("[aria-current]").first().innerHTML();
		await page.goto("/products");
		const activeLinkAfter = await nav.locator("[aria-current]").first().innerHTML();
		expect(activeLinkBefore).not.toBe(activeLinkAfter);
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
		await openRandomProductPage({ page });

		const title = await page.locator("h1").textContent();
		expect(await page.title()).toContain(title);
	});

	test(`7. single product SEO`, async ({ page }) => {
		await openRandomProductPage({ page });

		const metaDescription = page.locator('meta[name="description"]');
		const description = await metaDescription.getAttribute("content");
		expect(description).toBeTruthy();

		const text = await page.innerText("body");
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

		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.waitForURL(/(\/products\/\d+)|(\/products\/?$)/);
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);

		const list = page.getByTestId("products-list");
		const productListItems = list.locator("li");
		await productListItems.first().waitFor();
		expect(await productListItems.count()).toBeGreaterThan(0);
	});

	test(`9.`, () => {
		/** Nothing to do here */
	});
});
