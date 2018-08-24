const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();


gulp.task('jade', () => {
  const YOUR_LOCALS = {};
  gulp.src('./source/*.jade')
    .pipe($.jade({
      locals: YOUR_LOCALS,
      pretty: true,
    }))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  const plugins = [
    autoprefixer({ browsers: ['last 1 version'] }),
  ];
  return gulp.src('./source/sass/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
});

gulp.task('copyJS', () => {
  gulp.src('./source/js/**/*.js')
    .pipe(gulp.dest('./public/js'));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: './public',
    },
    reloadDebounce: 1000,
  });
});

gulp.task('watch', () => {
  gulp.watch('./source/*.jade', ['jade']);
  gulp.watch('./source/sass/*.scss', ['sass']);
  gulp.watch('./source/js/all.js', ['copyJS']);
});

gulp.task('default', ['jade', 'sass', 'copyJS', 'browser-sync', 'watch']);

