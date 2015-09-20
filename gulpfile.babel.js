import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
const $ = loadPlugins();

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task('lint', lint('./src/*.js'));

gulp.task('default', () => {
  return gulp.src('src/*.js')
    .pipe($.babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('watch', () => {
  gulp.watch('./src/*.js', ['default']);
});
