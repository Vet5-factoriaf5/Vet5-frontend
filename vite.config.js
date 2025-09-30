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
    react( ),
  ],
  // This is the configuration for Vitest.
  test: {
    // The "environment" option tells Vitest what environment to run the tests in.
    environment: "jsdom",

    // The "globals" option when set to "true", automatically provides test APIs.
    globals: true,

    // The "setupFiles" option points to a file that runs once before each test suite.
    setupFiles: "./src/setupTests.js",

    // The "include" option specifies the "glob patterns" for files that Vitest should consider as test files.
    include: ["**/*.{test,spec}.{js,mjs,cjs,mts,cts,jsx,tsx}"],

    // The "coverage" option is for configuring code coverage reports.
    coverage: {
      // The "provider" specifies which coverage engine to use.
      provider: 'v8',

      // "reporter" is an array of report formats to generate.
      reporter: ['text', 'html'],

      // "reportsDirectory" specifies the folder where the reports will be saved.
      reportsDirectory: './coverage',

      // "include" specifies which files should be included in the coverage report.
      include: ['src/components/**/*.{js,jsx}', 'src/pages/**/*.{js,jsx}'],

      // "exclude" specifies files to be ignored by the coverage report.
      exclude: [
        'src/main.jsx',
        'src/setupTests.js',
        // Puedes añadir aquí otros patrones a excluir
        // por ejemplo, archivos de solo estilos o constantes:
        // '**/*.css',
        // 'src/constants/**',
      ],
    },
  },
});
