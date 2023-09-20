import { test, expect, Request } from "@playwright/test";
import { beforeEach } from "node:test";
import {
	getProductPrices,
	getProductRatings,
	isNonDecresing,
	isNonIncreasing,
	openRandomProductPage,
} from "./utils";

test.describe("Module 4", () => {
	test(`1. webhook`, async ({ page }) => {
		/** Nothing to do here */
	});

	test(`2. open-graph`, async ({ page }) => {
		await openRandomProductPage({ page });

		const metaOgImage = page.locator('meta[property="og:image"]');
		const imageUrl = await metaOgImage.getAttribute("content");
		expect(imageUrl).toBeTruthy();
	});

	test(`3. reviews`, async ({ page }) => {
		await openRandomProductPage({ page });

		const form = page.getByTestId("add-review-form").first();
		await form.waitFor();

		await form.locator('[name="headline"]').first().waitFor();
		await form.locator('[name="content"]').first().waitFor();
		await form.locator('[name="rating"]').first().waitFor();
		await form.locator('[name="name"]').first().waitFor();
		await form.locator('[name="email"]').first().waitFor();
	});

	test(`4. optimistic reviews`, async ({ page }) => {
		// TODO: implement
	});

	test(`5. cart quantity`, async ({ page, context }) => {
		await context.clearCookies();

		await page.goto(`/products`);
		const list = page.getByTestId("products-list");
		const productLink = list.locator("li a");
		await productLink.first().waitFor();
		const count = await productLink.count();
		const randomProductLink = (await productLink
			.nth(Math.floor(Math.random() * count))
			.getAttribute("href"))!;

		// add to cart
		await page.goto(randomProductLink);
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.waitForURL(randomProductLink);
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.getByTestId("add-to-cart-button").click();
		await page.waitForResponse((response) => response.url().includes(randomProductLink));

		await page.goto("/cart");
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.waitForURL("/cart");
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		const quantity1 = Number.parseInt((await page.getByTestId("quantity").textContent())!);
		expect(quantity1).toBe(1);

		// add to cart
		await page.goto(randomProductLink);
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.waitForURL(randomProductLink);
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.getByTestId("add-to-cart-button").click();
		await page.waitForResponse((response) => response.url().includes(randomProductLink));

		await page.goto("/cart");
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.waitForURL("/cart");
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		const quantity2 = Number.parseInt((await page.getByTestId("quantity").textContent())!);
		expect(quantity2).toBe(2);
	});

	test(`6. increment and decrement on cart`, async ({ page, context }) => {
		await context.clearCookies();

		await page.goto(`/products`);
		const list = page.getByTestId("products-list");
		const productLink = list.locator("li a");
		await productLink.first().waitFor();
		const count = await productLink.count();
		const randomProductLink = (await productLink
			.nth(Math.floor(Math.random() * count))
			.getAttribute("href"))!;

		// add to cart
		await page.goto(randomProductLink);
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.waitForURL(randomProductLink);
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.getByTestId("add-to-cart-button").click();
		await page.waitForResponse((response) => response.url().includes(randomProductLink));

		await page.goto("/cart");
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		await page.waitForURL("/cart");
		await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
		expect(Number.parseInt((await page.getByTestId("quantity").textContent())!)).toBe(1);

		const incrementBtn = page.getByTestId("increment");
		const decrementBtn = page.getByTestId("decrement");

		await incrementBtn.click();
		expect(Number.parseInt((await page.getByTestId("quantity").textContent())!)).toBe(2);
		await incrementBtn.click();
		expect(Number.parseInt((await page.getByTestId("quantity").textContent())!)).toBe(3);
		await incrementBtn.click();
		expect(Number.parseInt((await page.getByTestId("quantity").textContent())!)).toBe(4);
		await incrementBtn.click();
		expect(Number.parseInt((await page.getByTestId("quantity").textContent())!)).toBe(5);

		await decrementBtn.click();
		await decrementBtn.click();
		expect(Number.parseInt((await page.getByTestId("quantity").textContent())!)).toBe(3);
	});

	test(`7. sort by prices`, async ({ page }) => {
		await page.goto(`/products`);

		const sortByPrice = page.getByTestId("sort-by-price");
		await sortByPrice.first().waitFor({ state: "hidden" });

		const el = await sortByPrice.first().elementHandle();
		const tagName = await el?.evaluate((e) => e.tagName);

		const pricesBefore = await getProductPrices({ page });

		// change sorting and assert the page has changed
		await expect(async () => {
			if (tagName === "OPTION") {
				const select = page.locator("select", { has: sortByPrice.first() });
				await select.first().waitFor();
				await select.selectOption({
					label: (await sortByPrice.first().evaluate((e) => (e as HTMLOptionElement).textContent))!,
				});
			} else if (tagName === "A") {
				await sortByPrice.first().click();
			} else if (tagName === "BUTTON") {
				await sortByPrice.first().click();
			}
			expect(await getProductPrices({ page })).not.toEqual(pricesBefore);
		}).toPass();

		const sortedPrices = await getProductPrices({ page });
		expect(
			isNonDecresing(sortedPrices) || isNonIncreasing(sortedPrices),
			"all prices to be sorted ASC or DESC",
		).toBeTruthy();
	});

	test(`8. sort by rating`, async ({ page }) => {
		await page.goto(`/products`);

		const sortByRating = page.getByTestId("sort-by-rating");
		await sortByRating.last().waitFor({ state: "hidden" });

		const el = await sortByRating.last().elementHandle();
		const tagName = await el?.evaluate((e) => e.tagName);

		const ratingsBefore = await getProductRatings({ page });

		// change sorting and assert the page has changed
		await expect(async () => {
			if (tagName === "OPTION") {
				const select = page.locator("select", { has: sortByRating.last() });
				await select.last().waitFor();
				await select.selectOption({
					label: (await sortByRating.last().evaluate((e) => (e as HTMLOptionElement).textContent))!,
				});
			} else if (tagName === "A") {
				await sortByRating.last().click();
			} else if (tagName === "BUTTON") {
				await sortByRating.last().click();
			}
			expect(await getProductRatings({ page })).not.toEqual(ratingsBefore);
		}).toPass();

		const sortedRatings = await getProductRatings({ page });
		expect(
			isNonDecresing(sortedRatings) || isNonIncreasing(sortedRatings),
			"all ratings to be sorted ASC or DESC",
		).toBeTruthy();
	});

	test(`9. AI related products`, async ({ page }) => {
		// TODO: implement
	});
});
