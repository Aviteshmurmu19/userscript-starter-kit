// @ts-check

import js from "@eslint/js";
import globals from "globals";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 1. Global ignores
  {
    ignores: [
      "dist/**", // Ignore the build output
      "node_modules/**", // Ignore dependencies
    ],
  },

  // 2. Base configuration for all JavaScript files
  js.configs.recommended,

  // 3. Configuration for your userscript source files
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script", // Userscripts are typically scripts, not modules
      globals: {
        ...globals.browser,
        // Add all common Violentmonkey/Tampermonkey globals here
        GM_addStyle: "readonly",
        GM_getValue: "readonly",
        GM_setValue: "readonly",
        GM_registerMenuCommand: "readonly",
        GM_xmlhttpRequest: "readonly",
        DOMParser: "readonly",
        unsafeWindow: "readonly",
      },
    },
    rules: {
      // Your preferred rules for your script's code
      "no-console": "off", // Allow console.log during development
      "prefer-const": "error",
      "no-var": "error",
    },
  },

  // 4. Configuration specifically for your Gulpfile
  {
    files: ["gulpfile.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // Gulpfiles use CommonJS require/exports
      globals: {
        ...globals.node, // Enable Node.js global variables
      },
    },
    rules: {
      // You might want different rules for your build script
      "no-console": "off", // console.log is common and useful in build scripts
    },
  },
];
