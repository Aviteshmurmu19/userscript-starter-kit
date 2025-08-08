# Developer's Guide to Customization

Welcome, developer! This guide is for you if you want to go beyond just using the starter kit and start modifying the build process itself. The `gulpfile.js` is designed to be modular and extensible.

This document will cover common customization scenarios.

## Table of Contents

- [Developer's Guide to Customization](#developers-guide-to-customization)
  - [Table of Contents](#table-of-contents)
    - [1. Customizing File Paths and Names](#1-customizing-file-paths-and-names)
    - [2. Working with Multiple JavaScript and CSS Files](#2-working-with-multiple-javascript-and-css-files)
      - [Multiple JavaScript Files](#multiple-javascript-files)
      - [Multiple CSS Files](#multiple-css-files)
    - [3. Advanced Minification Control (Terser \& CSSNano)](#3-advanced-minification-control-terser--cssnano)
      - [Terser Options](#terser-options)
      - [CSSNano Options](#cssnano-options)
    - [4. Adding Code Linting with ESLint](#4-adding-code-linting-with-eslint)
    - [5. Integrating New Build Steps (e.g., TypeScript, Sass)](#5-integrating-new-build-steps-eg-typescript-sass)

---

### 1. Customizing File Paths and Names

The source and output file names are defined within the Gulp tasks. You can easily change them by modifying the relevant strings in `gulpfile.js`.

**Example: Changing the output script name**

Locate the `assembleDev` and `assembleProd` tasks. You can change the argument passed to `rename()`:

```javascript
// In assembleDev()
.pipe(rename('my-new-script-name.user.js'))

// In assembleProd()
let outputFilename = 'my-new-script-name.min.js';
// ...
.pipe(rename(outputFilename))
```

---

### 2. Working with Multiple JavaScript and CSS Files

As your project grows, you'll want to split your code into multiple files for better organization.

#### Multiple JavaScript Files

To bundle multiple JS files, add them to the array in the `bundleJs` task. **The order matters!** Files are concatenated in the order they appear.

```javascript
// In gulpfile.js, inside the bundleJs task
function bundleJs() {
  return gulp
    .src(["src/utils.js", "src/core-logic.js"]) // Order is important!
    .pipe(concat("main.js"))
    .pipe(gulp.dest("dist/temp"));
}
```

#### Multiple CSS Files

The same principle applies to CSS. You must also add `gulp-concat` to the pipeline.

```javascript
// In gulpfile.js, inside the buildCss task
function buildCss() {
  // ...
  return gulp
    .src(["src/reset.css", "src/styles.css"])
    .pipe(concat("styles.css")) // Concat them into a single CSS file first
    .pipe(postcss([cssnano(cssnanoOptions)]))
    .pipe(gulp.dest("dist/temp"));
}
```

---

### 3. Advanced Minification Control (Terser & CSSNano)

You can pass detailed options to both Terser and CSSNano to fine-tune their behavior.

#### Terser Options

In the `assembleProd` task, expand the `terserOptions` object. For example, to remove all `console.log` statements from your production builds:

```javascript
// In assembleProd()
const terserOptions = {
  mangle: { toplevel: false },
  compress: {
    passes: 2,
    drop_console: true, // This will remove console.* statements
  },
};
```

For a full list of options, refer to the [official Terser documentation](https://terser.org/docs/api-reference#compress-options).

#### CSSNano Options

In the `buildCss` task, you can configure the `cssnanoOptions` object. For example, to prevent CSSNano from rebasing z-index values:

```javascript
// In buildCss()
const cssnanoOptions = {
  preset: [
    "default",
    {
      zindex: false, // Disables z-index rebasing
    },
  ],
};
```

For more details, see the [CSSNano presets documentation](https://cssnano.co/docs/presets/).

---

### 4. Adding Code Linting with ESLint

A linter acts as an automated code reviewer, catching errors and style issues early. This project is configured with the modern ESLint 9 using its "flat config" system. Here is a summary of how it was set up.

**Step 1: Install Dependencies**
The required packages are `eslint`, `@eslint/js`, `globals`, and `gulp-eslint-new`.

```bash
npm install --save-dev eslint@^9 @eslint/js@^9 globals@^15 gulp-eslint-new
```

**Step 2: Create Configuration File**
The new standard is to create an `eslint.config.mjs` file in the project root. This file defines different rules for your userscript source code and your Node.js-based Gulpfile.

**Step 3: Integrate with Gulp**
A `lintJs` task was created and added as the very first step in all build sequences using `gulp.series(lintJs, ...)`. This ensures that the build fails immediately if the code has any errors.

**Step 4: Add npm Scripts**
The `package.json` was updated with `lint` and `lint:fix` scripts for manual checks and auto-fixing.

```bash
# Run the linter to check for problems
npm run lint

# Run the linter and automatically fix simple issues
npm run lint:fix
```

---

### 5. Integrating New Build Steps (e.g., TypeScript, Sass)

The modular nature of the Gulpfile makes it easy to add new build tools like TypeScript or Sass. The pattern is:

1.  Install the necessary Gulp plugin (e.g., `gulp-typescript`).
2.  `require` it at the top of your `gulpfile.js`.
3.  Create a new asset preparation task (e.g., `transpileTs`).
4.  Add your new task to the `prepareAssets` parallel execution group and adjust the downstream tasks to use its output.

```javascript
// Example for a new task
const prepareAssets = gulp.parallel(transpileTs, bundleJs, buildCss, buildHtml);
```

Happy coding!
