/*
import gulp from "gulp";
import browser from "browser-sync";
import sass from "gulp-sass";
const browserSync = browser.create();
*/

let gulp = require("gulp");
let browserSync = require("browser-sync").create();
let sass = require("gulp-sass")(require("sass"));

// Compile sass into CSS & auto-inject into browsers
gulp.task("sass", function () {
  return gulp
    .src("node_modules/bootstrap/scss/bootstrap.scss")
    .pipe(sass())
    .pipe(gulp.dest("public/assets/css"))
    .pipe(browserSync.stream());
});

// Inject bootstrap js files into public folder
gulp.task("js", function () {
  return gulp
    .src([
      "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/bootstrap/js/dist/collapse.js",
      "node_modules/bootstrap/js/dist/dropdown.js",
    ])
    .pipe(gulp.dest("public/assets/js"))
    .pipe(browserSync.stream());
});
