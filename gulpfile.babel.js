import browserify from 'browserify';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import loadPlugins from 'gulp-load-plugins';
import babelify from 'babelify';
import fs from 'fs';
const $ = loadPlugins();
const reload = browserSync.reload;

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task('lint', lint('./src/*.js'));

gulp.task('serve:jquery', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: ['./examples/jquery/', './dist/'],
    },
  });

  gulp.watch('./lib/*.js', ['build'], reload);
  gulp.watch('./examples/jquery/index.html').on('change', reload);
  gulp.watch('./examples/jquery/main.js').on('change', reload);
});

gulp.task('serve:angular', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: ['./examples/angular-material/', './dist/'],
    },
  });

  gulp.watch('./lib/*.js', ['build'], reload);
  gulp.watch('./examples/angular-material/index.html').on('change', reload);
});

gulp.task('browserify', ['lint'], () => {
  const extensions = ['.js', '.json', '.es6'];
  return browserify({
      debug: true,
      extensions: extensions,
      standalone: 'NexmoVerify',
    })
    .transform(babelify.configure({
      extensions: extensions,
    }))
    .require('./src/index.js', {
      entry: true,
    })
    .bundle()
    .on('error', (err)=> {
      console.log('Error : ' + err.message);
    })
    .pipe(fs.createWriteStream('./dist/verify.js'));
});

gulp.task('build', ['browserify'], () => {
  return gulp.src('./dist/verify.js')
    .pipe($.rename('verify.min.js'))
    .pipe($.sourcemaps.init({
      loadMaps: true,
    }))
    .pipe($.uglify())
    .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', () => {
  return gulp.src('src/*.js')
    .pipe($.babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('watch', () => {
  gulp.watch('./src/*.js', ['default']);
});
