import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * The "defineConfig" helper function provides autocompletion & type checking for
 * this Vite configuration. It is a best practice to wrap this config object with it.
 * 👉 For more info please read: https://vite.dev/config/
 */
export default defineConfig({
  // This is the core configuration for Vite.
  plugins: [
    // This is the official plugin for React, using the SWC compiler for speed.
    // It is required for Vite to understand & process JSX.
    react(),
  ],
  // This is the configuration for Vitest.
  // The "test" property is a special key that Vitest recognizes.
  test: {
    // The "environment" option tells Vitest what environment to run the tests in.
    // "jsdom" simulates a browser environment, which is necessary for testing React Components.
    // It provides a global "window" & "document" object.
    environment: "jsdom",

    // The "include" option specifies the "glob patterns" for files that Vitest should consider as test files.
    // This setup will look for files with ".test" or ".spec" in their name.
    include: ["**/*.{test,spec}.{js,mjs,cjs,mts,cts,jsx,tsx}"],

    // The "globals" option when set to "true", automatically provides test APIs like
    // "describe", "it", "expect", and "beforeEach" without needing to import them.
    // This makes the test files cleaner & more concise.
    globals: true,

    // The "setupFiles" option points to a file that runs once before each test suite.
    // This is where we configure things like "global test setups" or "custom matchers".
    // Here, it is use to import the "@testing-library/jest-dom" matchers.
    setupFiles: "./src/setupTests.js",

    // The "coverage" option is for configuring code coverage reports.
    coverage: {
        // The "provider" specifies which coverage engine to use, "v8" is the default.
        provider: 'v8',

        // "reporter" is an array of report formats to generate.
        // "text" outputs a summary to the console.
        // "html" generates a full, browsable HTML report.
        reporter: ['text', 'html'],

        // "reportsDirectory" specifies the folder where the reports will be saved.
        reportsDirectory: './coverage',
    },
  },
});
