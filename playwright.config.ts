import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require("dotenv").config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./.",
	fullyParallel: false,
	workers: 1,
	reporter: [["line"], ["json", { outputFile: "test-results.json" }]],
	timeout: 10000,
	use: {
		baseURL: process.env.NEXT13MASTERS_URL,
		trace: "on-first-retry",
	},

	projects: [
		{
			name: "Chromium",
			use: { ...devices["Desktop Chrome"], channel: "chromium" },
		},
	],
});
