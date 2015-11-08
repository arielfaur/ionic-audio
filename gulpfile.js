var gulp = require('gulp');
var concat = require('gulp-ngconcat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('concat', function() {
  gulp.src(['src/*.js', 'src/**/*.js'])
    .pipe(concat('ionic-audio.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('compress', function() {
  gulp.src('dist/ionic-audio.js')
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['concat', 'compress']);
