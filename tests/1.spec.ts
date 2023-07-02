import envinfo from "envinfo";
import * as semver from "semver";

import { test, expect } from "@playwright/test";

test.describe("Module 1", () => {
	test("global tools installed correctly", async () => {
		const info = JSON.parse(
			await envinfo.run(
				{
					System: ["OS", "Shell"],
					Binaries: ["Node", "pnpm"],
					Browsers: ["Chrome"],
					IDEs: ["VSCode"],
					Utilities: ["Git"],
				},
				{ json: true, showNotFound: true },
			),
		) as EnvinfoResult;

		expect(semver.satisfies(info.Binaries.Node.version, ">=20.0.0")).toBe(true);
		expect(semver.satisfies(info.Binaries.pnpm.version, ">=8.6.0")).toBe(true);
		expect(semver.satisfies(info.IDEs.VSCode.version, ">=1.7.0")).toBe(true);
		expect(semver.satisfies(info.Utilities.Git.version, ">=2.23.0")).toBe(true);
	});

	test(`products list UI implemented`, async ({ page }) => {
		await page.goto("/products");

		const list = page.getByTestId("products-list");
		const products = await list.locator("li");
		expect(await products.count()).toBe(4);

		for (const li of await products.all()) {
			const name = await li.locator("h3").innerText();
			expect(name).toBeTruthy();
		}
	});
});

type EnvinfoResult = {
	System: {
		OS: string;
		Shell: {
			version: string;
			path: string;
		};
	};
	Binaries: {
		Node: {
			version: string;
			path: string;
		};
		npm: {
			version: string;
			path: string;
		};
		pnpm: {
			version: string;
			path: string;
		};
	};
	IDEs: {
		VSCode: {
			version: string;
			path: string;
		};
	};
	Browsers: {
		Chrome: {
			version: string;
		};
	};
	Utilities: {
		Git: {
			version: string;
		};
	};
};
