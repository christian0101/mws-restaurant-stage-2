var gulp = require('gulp');
var sass = require('gulp-sass');
//const autoprefixer = require('gulp-autoprefixer');
//var watch = require('gulp-watch');

gulp.task('default', function() {
  return gulp.watch('public/sass/**/*.scss', gulp.series('styles'));
});

gulp.task('styles', function() {
    return gulp.src('public/sass/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      //.pipe(autoprefixer({browsers: ['last 2 versions']}))
      .pipe(gulp.dest('public/css'));
});
