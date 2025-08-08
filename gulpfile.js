const gulp = require("gulp");
const eslint = require("gulp-eslint-new");

/**
 * Lints all JavaScript source files and the Gulpfile itself using ESLint.
 * The build will fail if any errors are found.
 */
function lintJs() {
  return gulp
    .src(["src/**/*.js", "gulpfile.js"]) // Added gulpfile.js
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

exports.lint = lintJs;
exports.default = lintJs;
