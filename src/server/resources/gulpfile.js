var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var nodemon = require('gulp-nodemon');
var webpack = require('webpack');
var gutil = require("gulp-util");
var stylus = require('gulp-stylus');
var del = require('del');


var env = process.env.NODE_ENV;
var isProd = env == 'production';
var outputPath = './output/release/dashboard-manage/';

gulp.task('stylus', function() {
  var g = gulp.src('./src/scss/**/*.styl');

  if (isProd) {
    g = g.pipe(stylus());
    g = g.pipe(gulp.dest(outputPath + 'css/'));
  } else {
    g = g.pipe(stylus());
    g = g.pipe(gulp.dest('./output/dev/css/'));
  }

  return g;
});

gulp.task('stylus:watch', function() {
  gulp.watch('./src/scss/**/*.styl', ['stylus']);
});

gulp.task('clean', function() {
  return del('./output/release/*');
});

gulp.task('copy', function() {
  var g = gulp.src(['./src/js/third_party/**/*.js', './src/css/**/*', './src/fonts/**/*', './src/images/**/*'], {
    base: 'src'
  });

  if (isProd) {
    g = g.pipe(gulp.dest(outputPath));
  } else {
    g = g.pipe(gulp.dest('./output/dev/'))
  }

  return g;
});

gulp.task('copy:views', function() {
  var g = gulp.src('./src/views/*');

  if (isProd) {
    g = g.pipe(gulp.dest(outputPath + '/views/'));
  } else {
    g = g.pipe(gulp.dest('./output/dev/views/'));
  }

  return g;
});

gulp.task('copy:watch', function() {
  gulp.watch('./src/views/*', ['copy:views']);
});

gulp.task('server', function() {
  nodemon({
    script: './server.js',
    ext: 'js html',
    env: {
      'NODE_ENV': 'development'
    }
  })
});

gulp.task('webpack', function() {
  webpack(require('./webpack.config.js'),
    function(err, stats) {
      if (err) throw new gutil.PluginError("webpack", err);
      gutil.log("[webpack]", stats.toString({
        colors: true,
        chunks: false,
      }));
    });
});


// gulp.task('default', ['copy', 'sass:watch', 'sass', 'copy:views', 'copy:watch', 'webpack', 'server']);

gulp.task('watch', function() {
  gulp.watch(`src/**/*`, ['copy', 'stylus:watch', 'stylus', 'copy:views', 'copy:watch', 'webpack']);
});

gulp.task('dev', function() {
  gulp.start(['default', 'watch']);
});

gulp.task('default', ['copy', 'stylus:watch', 'stylus', 'copy:views', 'copy:watch', 'webpack']);
gulp.task('preset', ['copy', 'stylus:watch', 'stylus', 'copy:views', 'copy:watch', 'webpack']);

gulp.task('release', ['clean'], function() {
  // gulp.start(['copy', 'sass', 'copy:views']);
  gulp.start(['copy', 'stylus', 'copy:views']);
});
