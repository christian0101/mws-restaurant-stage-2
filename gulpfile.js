const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');
const gzip = require('gulp-gzip');
//const autoprefixer = require('gulp-autoprefixer');

gulp.task('copy-index', function() {
  return gulp.src('public/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-restaurant', function() {
  return gulp.src('public/restaurant.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-images', function() {
  return gulp.src('public/imgs/**/*')
    .pipe(gulp.dest('dist/imgs'));
});

gulp.task('styles', function() {
  return gulp.src('public/sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    //.pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('modules', function() {
  return gulp.src(['public/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('other', function() {
  return gulp.src(['public/*.json', 'public/*.ico'])
    .pipe(gulp.dest('dist'));
});

gulp.task('sw', function() {
  return gulp.src(['public/sw.js'])
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts-dist', function() {
  return gulp.src('public/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('dist', gulp.series(
  'styles',
  'copy-index',
  'copy-restaurant',
  'copy-images',
  'modules',
  'scripts-dist',
  'other'
));

gulp.task('default', gulp.series('styles', 'copy-index', 'copy-restaurant', 'copy-images', 'modules', 'scripts-dist', 'other', function() {
  gulp.watch('public/sass/**/*.scss', gulp.series('styles'));
  gulp.watch('public/index.html', gulp.series('copy-index'));
  gulp.watch('public/restaurant.html', gulp.series('copy-restaurant'));
  gulp.watch('public/sw.js', gulp.series('sw'));
}));
