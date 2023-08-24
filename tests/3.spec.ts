import { test, expect, Request } from "@playwright/test";

test.describe("Module 3", () => {
	test(`1. single product page implemented`, async ({ page }) => {
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

	test(`2. categories pagination`, async ({ page }) => {
		await page.goto(`/`);

		const nav = page.getByRole("navigation").first();
		await nav.getByRole("link").last().click();
		await page.waitForURL("**/categories/**");

		const list = page.getByTestId("products-list");
		const productLink = list.locator("li a");
		await productLink.first().waitFor();
		const productsCount = await productLink.count();
		expect(productsCount).toBeGreaterThan(0);

		// paginated url
		expect(page.url()).toMatch(/\/categories\/.*\/\d+$/);

		const paginationLinks = page.getByLabel(/pagination/i).getByRole("link");
		await paginationLinks.first().waitFor();
		const paginationCount = await paginationLinks.count();
		expect(paginationCount).toBeGreaterThan(0);
	});

	test(`3. active links for partial matches`, async ({ page }) => {
		await page.goto(`/`);

		const nav = page.getByRole("navigation").first();

		const inactiveLinkBorderBottomColor = await nav
			.getByRole("link")
			.last()
			.evaluate((e) => window.getComputedStyle(e).borderBottomColor);

		const lastCategoryLink = nav.getByRole("link").last();
		const categoryName = await lastCategoryLink.textContent();
		await lastCategoryLink.click();
		await page.waitForURL("**/categories/**");

		const list = page.getByTestId("products-list");
		const productLink = list.locator("li a");
		await productLink.first().waitFor();

		const title = await page.locator("h1,h2").first().textContent();
		expect(await page.title()).toContain(categoryName);
		expect(title).toContain(categoryName);

		const activeLinkBorderBottomColor = await nav
			.getByRole("link")
			.last()
			.evaluate((e) => window.getComputedStyle(e).borderBottomColor);

		// paginated url
		expect(page.url()).toMatch(/\/categories\/.*\/\d+$/);
		expect(activeLinkBorderBottomColor).not.toBe(inactiveLinkBorderBottomColor);
	});

	test(`4. collections`, async ({ page }) => {
		await page.goto(`/`);

		const links = page.locator('[href*="/collections/"]');
		await links.first().waitFor();
		const linksCount = await links.count();
		expect(linksCount).toBeGreaterThan(0);

		const randomLink = links.nth(Math.floor(Math.random() * linksCount));
		const collectionName = await randomLink.textContent();
		randomLink.click();

		expect(collectionName).toBeTruthy();
		await page.waitForURL("**/collections/**");

		const title = page.getByRole("heading", { name: collectionName! });
		await title.waitFor();
		expect(await page.title()).toContain(collectionName);
	});

	test(`4. `, () => {
		/** Nothing to do here */
	});

	test(`5. related products`, async ({ page }) => {
		await page.goto(`/`);
		const list = page.getByTestId("products-list");
		const productLink = list.locator("li a");
		await productLink.first().waitFor();
		const count = await productLink.count();
		expect(count).toBeGreaterThan(0);
		const randomProductLink = productLink.nth(Math.floor(Math.random() * count));
		await randomProductLink.click();
		await page.waitForURL("**/product/**");

		const relatedProducts = page.getByTestId("related-products");
		await relatedProducts.waitFor();
		await relatedProducts.locator("li a").first().waitFor();
		const relatedProductsCount = await relatedProducts.locator("li a").count();
		expect(relatedProductsCount).toBeGreaterThan(0);
	});

	test(`6. variants`, () => {
		// TODO: implement
	});

	test(`7. `, () => {
		/** Nothing to do here */
	});

	test(`8. search`, async ({ page }) => {
		await page.goto("/");

		// search for a random existing product
		const search = page.getByRole("searchbox");
		await search.waitFor();

		const list = page.getByTestId("products-list");
		const productLink = list.locator("li a");
		await productLink.first().waitFor();
		const count = await productLink.count();
		const randomProductLink = productLink.nth(Math.floor(Math.random() * count));
		const productName = await randomProductLink.getByRole("heading").textContent();
		expect(productName).toBeTruthy();

		await search.fill(productName!);
		await search.press("Enter");

		await page.waitForURL(`**/search?query=${encodeURIComponent(productName!)}`);

		// assert the product was found
		{
			const list = page.getByTestId("products-list");
			const productLink = list.locator("li a");
			await productLink.first().waitFor();
			const product = productLink.getByText(productName!);
			await product.first().waitFor();
		}

		// search by URL
		await page.goto("/");
		await page.goto(`/search?query=${encodeURIComponent(productName!)}`);

		// assert the product was found
		{
			const list = page.getByTestId("products-list");
			const productLink = list.locator("li a");
			await productLink.first().waitFor();
			const product = productLink.getByText(productName!);
			await product.first().waitFor();
		}
	});

	test(`9. delayed search`, async ({ page }) => {
		await page.goto("/");

		// search for a random existing product
		const search = page.getByRole("searchbox");
		await search.waitFor();

		const list = page.getByTestId("products-list");
		const productLink = list.locator("li a");
		await productLink.first().waitFor();
		const count = await productLink.count();
		const randomProductLink = productLink.nth(Math.floor(Math.random() * count));
		const productName = await randomProductLink.getByRole("heading").textContent();
		expect(productName).toBeTruthy();

		const requests: string[] = [];
		page.on("request", (request) => requests.push(request.url()));

		// human-like delay
		await search.type(productName!, { delay: 166 });

		// count how many requests were made
		await page.waitForURL(`**/search?query=${encodeURIComponent(productName!)}`);
		const uniqueQueries = new Set(
			requests
				.filter((url) => url.includes("/search?query="))
				.map((url) => new URL(url).searchParams.get("query")),
		);
		expect(uniqueQueries.size).toBe(1);

		// assert the product was found
		{
			const list = page.getByTestId("products-list");
			const productLink = list.locator("li a");
			await productLink.first().waitFor();
			const product = productLink.getByText(productName!);
			await product.first().waitFor();
		}
	});
});
