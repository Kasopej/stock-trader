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
