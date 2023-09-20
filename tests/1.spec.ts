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

		const getVersion = (value: string | { version: string }) =>
			(typeof value === "string" ? value : value.version)
				.replace(/[^0-9.]/g, "")
				.replace(/\.+/g, ".")
				.replace(/^(\d+\.\d+\.\d+)(.*)$/g, "$1")
				.replace(/\.$/g, "");

		const NodeVersion = getVersion(info.Binaries.Node);
		const pnpmVersion = getVersion(info.Binaries.pnpm);
		const VSCodeVersion = getVersion(info.IDEs.VSCode);
		const GitVersion = getVersion(info.Utilities.Git);

		expect(
			semver.satisfies(NodeVersion, ">=20.0.0"),
			`Expected Node version newer than 20.0.0 but got ${NodeVersion}`,
		).toBe(true);
		expect(
			semver.satisfies(pnpmVersion, ">=8.6.0"),
			`Expected pnpm version newer than 8.6.0 but got ${pnpmVersion}`,
		).toBe(true);
		expect(
			semver.satisfies(VSCodeVersion, ">=1.7.0"),
			`Expected VSCode version newer than 1.7.0 but got ${VSCodeVersion}`,
		).toBe(true);
		expect(
			semver.satisfies(GitVersion, ">=2.23.0"),
			`Expected Git version newer than 2.23.0 but got ${GitVersion}`,
		).toBe(true);
	});

	test(`products list UI implemented`, async ({ page }) => {
		await page.goto("/");

		const list = page.getByTestId("products-list");
		const products = await list.locator("li");
		await products.first().waitFor();
		expect(await products.count()).toBeGreaterThanOrEqual(4);

		for (const li of await products.all()) {
			const name = await li.getByRole("heading").first().innerText();
			expect(name).toBeTruthy();
		}
	});
});

type EnvinfoResult = {
	System: {
		OS: string;
		Shell:
			| string
			| {
					version: string;
					path: string;
			  };
	};
	Binaries: {
		Node:
			| string
			| {
					version: string;
					path: string;
			  };
		npm:
			| string
			| {
					version: string;
					path: string;
			  };
		pnpm:
			| string
			| {
					version: string;
					path: string;
			  };
	};
	IDEs: {
		VSCode:
			| string
			| {
					version: string;
					path: string;
			  };
	};
	Browsers: {
		Chrome:
			| string
			| {
					version: string;
			  };
	};
	Utilities: {
		Git:
			| string
			| {
					version: string;
			  };
	};
};
