const gulp = require('gulp');
const fs = require('fs');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const Path = {
  Js: './src/js/',
  Scss: 'src/scss/',
  Ejs: 'src/ejs/',
  Img: 'src/img/',
  Dist: 'dist/',
};

gulp.task('scss', () => {
  gulp.src(`${Path.Scss}**/*.scss`)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'expanded',
    }))
    .pipe($.autoprefixer({
      browsers: ['last 3 version'],
      cascade: false,
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(`${Path.Dist}css/`))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('ejs', () => {
  const config = JSON.parse(fs.readFileSync(`${Path.Ejs}config.json`));
  const data = config.data;
  const pages = config.pages;
  for (const page of pages) {
    gulp.src(`${Path.Ejs}**.ejs`)
      .pipe($.ejs({
        data,
        page,
      }))
      .pipe($.rename(`${page.filename}.html`))
      .pipe(gulp.dest(`${Path.Dist}${page.directory}`))
      .pipe(browserSync.reload({ stream: true }));
  }
});

gulp.task('img', () => {
  gulp.src(`${Path.Img}*`)
    .pipe($.imagemin([
      $.imagemin.gifsicle({ interlaced: true }),
      $.imagemin.jpegtran({ progressive: true }),
      $.imagemin.optipng({ optimizationLevel: 7 }),
      $.imagemin.svgo({ plugins: [{ removeViewBox: true }] }),
    ]))
    .pipe(gulp.dest(`${Path.Dist}img/`));
});

gulp.task('webpack', () => {
  gulp.src(`${Path.Js}**/*.js`)
    .pipe($.plumber())
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest('./dist/js'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: './dist/',
    },
  });
});

const tasks = [
  'scss',
  'ejs',
  'img',
  'webpack',
  'browser-sync',
];

gulp.task('default', tasks, () => {
  gulp.watch([`${Path.Js}**/*.js`], ['webpack']);
  gulp.watch([`${Path.Scss}**/*.scss`], ['scss']);
  gulp.watch([`${Path.Ejs}**/**.ejs`], ['ejs']);
  gulp.watch([`${Path.Img}*`], ['img']);
});
