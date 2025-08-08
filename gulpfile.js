const gulp = require('gulp');
const concat = require('gulp-concat');
const terser = require('terser');
const { minify: htmlmin } = require('html-minifier-terser');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const replace = require('gulp-replace');
const rename = new require('gulp-rename');
const fs = require('fs-extra');

const isAggressive = process.env.AGGRESSIVE === 'true';

// --- Asset Preparation Tasks ---

// This task ONLY bundles the JavaScript. That's it.
function bundleJs() {
  return gulp.src(['src/core-logic.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/temp'));
}

// This task ONLY minifies the CSS.
function buildCss() {
  return gulp.src('src/styles.css')
    .pipe(postcss([cssnano()]))
    .pipe(gulp.dest('dist/temp'));
}

// This task ONLY minifies the HTML.
async function buildHtml() {
  const uiHtml = await fs.readFile('src/ui.html', 'utf8');
  const minifiedHtml = await htmlmin(uiHtml, {
    collapseWhitespace: true,
    removeComments: true,
  });
  // Save the minified HTML to a temp file
  await fs.writeFile('dist/temp/ui.html', minifiedHtml, 'utf8');
}

// --- Final Assembly Tasks ---

// This is where all the pieces come together for the DEV version.
async function assembleDev() {
  const bundledJs = await fs.readFile('dist/temp/main.js', 'utf8');
  const minifiedCss = await fs.readFile('dist/temp/styles.css', 'utf8');
  const minifiedHtml = await fs.readFile('dist/temp/ui.html', 'utf8');

  // Escape backticks for injection into a template literal
  const injectableHtml = minifiedHtml.replace(/`/g, '\\`');
  const cssInjection = `GM_addStyle(\`${minifiedCss.replace(/`/g, '\\`')}\`);`;

  // First, inject the HTML into the JS bundle
  const jsWithHtml = bundledJs.replace('`{{UI_HTML}}`', `\`${injectableHtml}\``);

  // Then, inject the CSS and the JS-with-HTML into the main template
  return gulp.src('src/template.js')
    .pipe(replace('// {{STYLES}}', cssInjection))
    .pipe(replace('// {{CODE}}', jsWithHtml))
    .pipe(rename('my-cool-script.user.js'))
    .pipe(gulp.dest('dist/'));
}

// This is where all the pieces come together for the PROD version.
async function assembleProd() {
  // Read all the pre-processed assets
  let bundledJs = await fs.readFile('dist/temp/main.js', 'utf8');
  const minifiedCss = await fs.readFile('dist/temp/styles.css', 'utf8');
  const minifiedHtml = await fs.readFile('dist/temp/ui.html', 'utf8');

  // Escape and prepare for injection
  const injectableHtml = minifiedHtml.replace(/`/g, '\\`');
  const cssInjection = `GM_addStyle(\`${minifiedCss.replace(/`/g, '\\`')}\`);`;

  // Inject HTML into JS
  bundledJs = bundledJs.replace('`{{UI_HTML}}`', `\`${injectableHtml}\``);

  // Now, minify the final JS bundle
  const terserOptions = {
    mangle: { toplevel: false },
    compress: { passes: 2 },
  };
  let outputFilename = 'my-cool-script.min.user.js';
  if (isAggressive) {
    // ... (aggressive options)
    outputFilename = 'my-cool-script.aggressive.min.user.js';
  }
  const minifiedJsResult = await terser.minify(bundledJs, terserOptions);
  const minifiedJs = minifiedJsResult.code;

  // Finally, inject into the main template
  return gulp.src('src/template.js')
    .pipe(replace('// {{STYLES}}', cssInjection))
    .pipe(replace('// {{CODE}}', minifiedJs))
    .pipe(rename(outputFilename))
    .pipe(gulp.dest('dist/'));
}

// --- Combined Build Commands ---
const prepareAssets = gulp.parallel(bundleJs, buildCss, buildHtml);
const buildDev = gulp.series(prepareAssets, assembleDev);
const buildProd = gulp.series(prepareAssets, assembleProd);
const build = gulp.series(prepareAssets, gulp.parallel(assembleDev, buildProd));

function watchTask() {
  gulp.watch(['src/**/*.js', 'src/**/*.css', 'src/**/*.html'], build);
}

// --- Exports ---
exports.build = build;
exports.buildDev = buildDev;
exports.buildProd = buildProd;
exports.watch = watchTask;
exports.default = build;