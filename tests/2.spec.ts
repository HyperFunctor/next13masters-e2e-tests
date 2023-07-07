import { test, expect } from "@playwright/test";

test.describe("Module 2", () => {
	test(`active link in navbar implemented`, async ({ page }) => {
		await page.goto("/");

		const nav = page.getByRole("navigation").first();
		await expect(nav.getByRole("link", { name: "Home" })).toBeTruthy();
		await expect(nav.getByRole("link", { name: "All" })).toBeTruthy();

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

	test(`products list API implemented`, async ({ page }) => {
		await page.goto("/products");

		const list = await page.getByTestId("products-list");
		const productListItems = await list.locator("li");
		expect(await productListItems.count()).toBe(10);

		const productsRes = await fetch(`https://naszsklep-api.vercel.app/api/products?take=20`);
		const productsData = await productsRes.json();

		const productListItemsElements = await productListItems.all();
		for (let i = 0; i < productListItemsElements.length; i++) {
			const title = await productListItemsElements[i].locator("h3").innerText();
			expect(title).toMatch(productsData[i].title);
		}
	});

	test(`single product page implemented`, async ({ page }) => {
		const productsRes = await fetch(`https://naszsklep-api.vercel.app/api/products?take=20`);
		const productsData = await productsRes.json();
		const randomProduct = productsData[Math.floor(Math.random() * productsData.length)];

		await page.goto(`/product/${randomProduct.id}`);
		await expect(page.locator("h1")).toContainText(randomProduct.title);
		expect(await page.title()).toContain(randomProduct.title);
	});
});
