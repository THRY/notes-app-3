var gulp        = require('gulp');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;
var sass        = require('gulp-sass');
var nodemon     = require('gulp-nodemon');


// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'nodemon'], function() {

    browserSync({
        proxy: "localhost:3000",  // local node app address
        port: 5000,  // use *different* port than above
        notify: true
    });

    gulp.watch("./public/stylesheets/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch(['././public/javascripts/*.js']).on('change', browserSync.reload);

});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./public/stylesheets/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./public/stylesheets/"))
        .pipe(browserSync.stream());
});

gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
      script: 'app.js',
      ignore: [
        'gulpfile.js',
        'node_modules/'
      ]
    })
    .on('start', function () {
      if (!called) {
        called = true;
        cb();
      }
    })
    .on('restart', function () {
      setTimeout(function () {
        reload({ stream: false });
      }, 1000);
    });
  });

gulp.task('default', ['serve']);

