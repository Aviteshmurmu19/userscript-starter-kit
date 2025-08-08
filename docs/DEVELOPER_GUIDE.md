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
    - [4. Integrating New Build Steps (e.g., TypeScript, Sass)](#4-integrating-new-build-steps-eg-typescript-sass)
    - [5. Adding Code Linting (ESLint)](#5-adding-code-linting-eslint)

---

### 1. Customizing File Paths and Names

The source and output file names are defined at the top of the Gulp tasks. You can easily change them by modifying the relevant strings.

**Example: Changing the output script name**

In `gulpfile.js`, locate the `assembleDev` and `assembleProd` tasks. You can change the argument passed to `rename()`:

```javascript
// In assembleDev()
.pipe(rename('my-new-script-name.user.js'))

// In assembleProd()
let outputFilename = 'my-new-script-name.min.js';
// ...
.pipe(rename(outputFilename))
```

Similarly, you can change the source paths in the `gulp.src()` calls if you decide to restructure the `src/` folder.

---

### 2. Working with Multiple JavaScript and CSS Files

As your project grows, you'll want to split your code into multiple files for better organization. The build system handles this easily.

#### Multiple JavaScript Files

Let's say you have `src/utils.js` and `src/core-logic.js`. To bundle them, simply add them to the array in the `bundleJs` task.

**Important:** The order matters! Files will be concatenated in the order they appear in the array. If `core-logic.js` depends on functions from `utils.js`, then `utils.js` must come first.

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

The same principle applies to CSS. If you have a `reset.css` that should come before your main styles:

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

_Note: We added `gulp-concat` to the CSS task to merge the files before minification._

---

### 3. Advanced Minification Control (Terser & CSSNano)

You can pass detailed options to both Terser and CSSNano to fine-tune their behavior.

#### Terser Options

In the `assembleProd` task, you can expand the `terserOptions` object. For example, to remove all `console.log` statements from your production builds:

```javascript
// In assembleProd()
const terserOptions = {
  mangle: { toplevel: false },
  compress: {
    passes: 2,
    drop_console: true, // This will remove console.* statements
  },
};

if (isAggressive) {
  // ...
  terserOptions.compress.unsafe_arrows = true;
}
```

For a full list of options, refer to the [official Terser documentation](https://terser.org/docs/api-reference#compress-options).

#### CSSNano Options

Similarly, you can configure the `cssnanoOptions` object. For example, to prevent CSSNano from rebasing z-index values (a common requirement):

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

### 4. Integrating New Build Steps (e.g., TypeScript, Sass)

The modular nature of the Gulpfile makes it easy to add new build tools. Let's use **TypeScript** as an example.

**The Pattern:**

1.  Install the necessary Gulp plugin (`npm install --save-dev gulp-typescript`).
2.  `require` it at the top of your `gulpfile.js`.
3.  Create a new asset preparation task.
4.  Add your new task to the `prepareAssets` parallel execution.

**Example Implementation:**

1.  **Install:** `npm install --save-dev typescript gulp-typescript`
2.  **Gulpfile:**
    ```javascript
    // At the top of gulpfile.js
    const ts = require('gulp-typescript');

        // ...

        /**
         * Transpiles TypeScript files to JavaScript.
         */
        function transpileTs() {
          return gulp.src('src/**/*.ts')
            .pipe(ts({
              // Add your tsconfig.json options here if needed
              target: 'ES2015',
              noImplicitAny: true,
            }))
            .pipe(gulp.dest('dist/temp/ts-output')); // Output to a temporary folder
        }

        // Modify the bundleJs task to use the compiled TS output
        function bundleJs() {
          // Use the output from the TypeScript task as the source
          return gulp.src(['dist/temp/ts-output/**/*.js'])
            .pipe(concat('main.js'))
            .pipe(gulp.dest('dist/temp'));
        }

        // Add the new task to the build chain
        const prepareAssets = gulp.parallel(transpileTs, buildCss, buildHtml);
        const buildDev = gulp.series(prepareAssets, gulp.series(bundleJs, assembleDev));
        // ... update other build chains similarly
        ```

    You can apply this same pattern to add support for Sass (`gulp-sass`), Babel (`gulp-babel`), or any other pre-processor.

---

### 5. Adding Code Linting (ESLint)

A linter analyzes your code for potential errors and style issues. It's a best practice to run a linter before any build process.

**Pattern:**

1.  Install the necessary packages (`npm install --save-dev gulp-eslint-new eslint`).
2.  Create a `.eslintrc.json` configuration file in your project root.
3.  Create a new `lintJs` task in your Gulpfile.
4.  Add the `lint` task to run **before** your other build steps using `gulp.series`.

**Example Implementation:**

1.  **Install:** `npm install --save-dev gulp-eslint-new eslint`
2.  **Create `.eslintrc.json`:**
    ```json
    {
      "env": { "browser": true, "es2021": true },
      "extends": "eslint:recommended",
      "parserOptions": { "ecmaVersion": "latest" }
    }
    ```
3.  **Gulpfile:**

    ```javascript
    // At the top of gulpfile.js
    const eslint = require("gulp-eslint-new");

    // ...

    /**
     * Lints JavaScript files for errors and style issues.
     */
    function lintJs() {
      return gulp
        .src("src/**/*.js")
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError()); // Fails the build if an error is found
    }

    // Add linting as the VERY FIRST step of your build process
    const build = gulp.series(
      lintJs,
      prepareAssets,
      gulp.parallel(assembleDev, assembleProd)
    );
    // ... update other tasks similarly
    ```

This ensures that your build will fail immediately if your code has any linting errors, preventing broken code from being deployed.

Happy coding!
