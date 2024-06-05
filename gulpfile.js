
const gulp = require('gulp');
const concat = require('gulp-concat-css');
const plumber = require('gulp-plumber');
const del = require('del');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const sourcemap = require("gulp-sourcemaps");
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}
function html() {
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function scripts() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(plumber())
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}

function scss() {
  const plugins = [
    autoprefixer()
  ];
  return gulp.src('src/page/index.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    // надо для отлова ошибок в скобках
    .pipe(sass({ outputStyle: 'compressed' })
      // очень нужно для отлова ошибок чтобы сасс не вставал
      .on('error', sass.logError))
    .pipe(concat('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({ stream: true }));
}
function images() {
  return gulp.src('src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}', { encoding: false })
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.reload({ stream: true }));
}

function fonts() {
  return gulp.src('src/fonts/**/*', { encoding: false })
    .pipe(gulp.dest('dist/fonts'))
    .pipe(browserSync.reload({ stream: true }));
}
function clean() {
  return del('dist');
}
function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/**/*.scss'], scss);
  gulp.watch(['src/images/**/*.{jpg,png,svg,gif,ico,webp,avif}'], images);
  gulp.watch(['src/fonts/**/*'], fonts);
  gulp.watch(['src/scripts/**/*.js'], scripts);
}
const build = gulp.series(clean, gulp.parallel(html, scss, images, fonts, scripts));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.scripts = scripts;
exports.html = html;
exports.fonts = fonts;
exports.css = scss;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;
