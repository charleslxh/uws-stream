'use strict';

const gulp = require('gulp');
const gutil = require('gutil');
const babel = require('gulp-babel');

gulp.task('build', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('./lib/'))
});

gulp.task('default', ['build'], function() {
  gulp.watch('src/**/*.js', ['build']).on('change', function(event) {
    gutil.log(gutil.colors.magenta('File ' + event.path + ' was ' + event.type + ', try rebuild'));
  });
});
