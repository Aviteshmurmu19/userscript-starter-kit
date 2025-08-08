/**
 * Gulp build file for the Userscript Starter Kit.
 *
 * This file automates the process of building the userscript from its source files.
 * It handles bundling, minification, and assembly for development and production environments.
 *
 * Main tasks:
 *  - `gulp build`: Builds both development and standard production versions.
 *  - `gulp watch` or `npm start`: Watches for file changes and triggers a full rebuild.
 *  - `npm run build:aggressive`: Creates an ultra-optimized production build.
 */

const gulp = require("gulp");
const concat = require("gulp-concat");
const terser = require("terser");
const { minify: htmlmin } = require("html-minifier-terser");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const replace = require("gulp-replace");
const rename = new require("gulp-rename");
const fs = require("fs-extra");

// Determines if the aggressive build options should be used, based on an environment variable.
const isAggressive = process.env.AGGRESSIVE === "true";

// --- Asset Preparation Tasks ---
// These tasks process the source files and save them to a temporary directory.

/**
 * Bundles all JavaScript files from src/ into a single main.js file in the temp directory.
 */
function bundleJs() {
  return gulp
    .src(["src/core-logic.js"])
    .pipe(concat("main.js"))
    .pipe(gulp.dest("dist/temp"));
}

/**
 * Minifies CSS using PostCSS and CSSNano.
 * Switches to a more aggressive preset if the AGGRESSIVE flag is set.
 */
function buildCss() {
  const cssnanoOptions = {
    preset: "default",
  };

  // For the aggressive build, switch to the advanced preset for max optimization.
  if (isAggressive) {
    console.log("Using aggressive CSSNano preset...");
    cssnanoOptions.preset = "advanced";
  }

  return gulp
    .src("src/styles.css")
    .pipe(postcss([cssnano(cssnanoOptions)]))
    .pipe(gulp.dest("dist/temp"));
}

/**
 * Minifies the main HTML UI file and saves it to the temp directory.
 */
async function buildHtml() {
  const uiHtml = await fs.readFile("src/ui.html", "utf8");
  const minifiedHtml = await htmlmin(uiHtml, {
    collapseWhitespace: true,
    removeComments: true,
  });
  await fs.writeFile("dist/temp/ui.html", minifiedHtml, "utf8");
}

// --- Final Assembly Tasks ---
// These tasks take the processed assets and assemble the final userscript files.

/**
 * Assembles the non-minified (development) version of the userscript.
 */
async function assembleDev() {
  // Read all processed assets from the temporary directory.
  const bundledJs = await fs.readFile("dist/temp/main.js", "utf8");
  const minifiedCss = await fs.readFile("dist/temp/styles.css", "utf8");
  const minifiedHtml = await fs.readFile("dist/temp/ui.html", "utf8");

  // Prepare assets for safe injection into the final script.
  const injectableHtml = minifiedHtml.replace(/`/g, "\\`");
  const cssInjection = `GM_addStyle(\`${minifiedCss.replace(/`/g, "\\`")}\`);`;

  // First, inject the minified HTML into the bundled JavaScript.
  const jsWithHtml = bundledJs.replace(
    "`{{UI_HTML}}`",
    `\`${injectableHtml}\``
  );

  // Then, inject the CSS and the JS-with-HTML into the main template.
  return gulp
    .src("src/template.js")
    .pipe(replace("// {{STYLES}}", cssInjection))
    .pipe(replace("// {{CODE}}", jsWithHtml))
    .pipe(rename("my-cool-script.user.js"))
    .pipe(gulp.dest("dist/"));
}

/**
 * Assembles the minified (production) version of the userscript.
 */
async function assembleProd() {
  // Read all processed assets.
  let bundledJs = await fs.readFile("dist/temp/main.js", "utf8");
  const minifiedCss = await fs.readFile("dist/temp/styles.css", "utf8");
  const minifiedHtml = await fs.readFile("dist/temp/ui.html", "utf8");

  // Prepare assets for injection.
  const injectableHtml = minifiedHtml.replace(/`/g, "\\`");
  const cssInjection = `GM_addStyle(\`${minifiedCss.replace(/`/g, "\\`")}\`);`;

  // Inject the HTML into the JavaScript before minifying.
  bundledJs = bundledJs.replace("`{{UI_HTML}}`", `\`${injectableHtml}\``);

  // Define Terser options for standard and aggressive minification.
  const terserOptions = {
    mangle: { toplevel: false },
    compress: { passes: 2 },
  };
  let outputFilename = "my-cool-script.min.user.js";

  // If the aggressive flag is set, use more powerful (and potentially risky) options.
  if (isAggressive) {
    console.log("Using aggressive Terser options...");
    terserOptions.mangle.toplevel = true;
    terserOptions.compress.passes = 3;
    terserOptions.compress.unsafe = true;
    outputFilename = "my-cool-script.aggressive.min.user.js";
  }

  // Minify the final JS bundle programmatically.
  const minifiedJsResult = await terser.minify(bundledJs, terserOptions);
  const minifiedJs = minifiedJsResult.code;

  // Finally, inject the minified assets into the main template.
  return gulp
    .src("src/template.js")
    .pipe(replace("// {{STYLES}}", cssInjection))
    .pipe(replace("// {{CODE}}", minifiedJs))
    .pipe(rename(outputFilename))
    .pipe(gulp.dest("dist/"));
}

// --- Combined Build Commands ---

// Group asset preparation tasks to run in parallel for speed.
const prepareAssets = gulp.parallel(bundleJs, buildCss, buildHtml);

// Define the main build tasks by chaining asset preparation and final assembly.
const buildDev = gulp.series(prepareAssets, assembleDev);
const buildProd = gulp.series(prepareAssets, assembleProd);

// The main `build` command runs both dev and standard prod assemblies in parallel.
const build = gulp.series(prepareAssets, gulp.parallel(assembleDev, buildProd));

/**
 * The watch task monitors all source files and triggers a full rebuild on change.
 */
function watchTask() {
  gulp.watch(["src/**/*.js", "src/**/*.css", "src/**/*.html"], build);
}

// --- Exports for Gulp CLI ---
// Expose tasks to be run from the command line (e.g., `gulp build`).
exports.build = build;
exports.buildDev = buildDev;
exports.buildProd = buildProd;
exports.watch = watchTask;
exports.default = build; // The default task when running `gulp` is `build`.
