import { Page, expect } from "@playwright/test";

export async function openRandomProductPage({ page }: { page: Page }) {
	await page.goto(`/products`);
	const list = page.getByTestId("products-list");
	const productLink = list.locator("li a");
	await productLink.first().waitFor();
	const count = await productLink.count();
	expect(count).toBeGreaterThan(0);
	const randomProductLink = productLink.nth(Math.floor(Math.random() * count));
	await randomProductLink.click();
	await page.waitForURL("**/product/**");
}

export async function getProductPrices({ page }: { page: Page }) {
	const productPrices = page.getByTestId("products-list").getByTestId("product-price");
	await productPrices.first().waitFor();
	const count = await productPrices.count();
	expect(count).toBeGreaterThan(0);
	const parsedPrices = (
		await Promise.all((await productPrices.all()).map((e) => e.textContent()))
	).map((el) => Number.parseFloat((el || "")?.replace("$", "").replace(",", ".").trim()));
	return parsedPrices;
}
export async function getProductRatings({ page }: { page: Page }) {
	const productRatings = page.getByTestId("products-list").getByTestId("product-rating");
	if ((await productRatings.count()) === 0) {
		return [];
	}

	await productRatings.first().waitFor();
	const parsedRatings = (
		await Promise.all((await productRatings.all()).map((e) => e.textContent()))
	).map((el) => Number.parseFloat((el || "")?.replace(",", ".").trim()));
	return parsedRatings;
}

export function isNonDecresing(arr: number[]): boolean {
	for (let i = 1; i < arr.length; ++i) {
		if (arr[i] < arr[i - 1]) {
			return false;
		}
	}
	return true;
}
export function isNonIncreasing(arr: number[]): boolean {
	for (let i = 1; i < arr.length; ++i) {
		if (arr[i] > arr[i - 1]) {
			return false;
		}
	}
	return true;
}
