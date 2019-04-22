// Gulp.js configuration

  // modules
const gulp = require('gulp');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');
const concat = require('gulp-concat');
const deporder = require('gulp-deporder');
const stripdebug = require('gulp-strip-debug');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const assets = require('postcss-assets');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const hb = require('gulp-hb');
const frontMatter = require('gulp-front-matter');

  // development mode?
let devBuild = (process.env.NODE_ENV !== 'production');


  // folders
const folder = {
    src: 'src/',
    build: 'build/',
    tmp: '.tmp/',
    public: 'public/'
  };

// image processing
gulp.task('images', function() {
  if (!devBuild) {
    var out = folder.public + 'images/';
  } else {
    var out = folder.build + 'images/';
  }
  
  return gulp.src(folder.src + 'images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});

// template injection
function inject() {
    return gulp
        .src('src/*.html')
        .pipe(frontMatter({
          property: 'data.frontMatter'
        }))
        .pipe(hb()
            .partials('./src/html/partials/**/*.hbs')
            .helpers({
              if_eq: function(a, b, opts) {
                  if (a == b) {
                      return opts.fn(this);
                  } else {
                      return opts.inverse(this);
                  }
              }
            })
            // .data('./src/assets/data/**/*.{js,json}')
        )

        .pipe(gulp.dest(folder.tmp));
}

gulp.task('inject', inject);

// html process
gulp.task('html', gulp.series('inject','images', function() {
  if (!devBuild) {
    var out = folder.public;
  } else {
    var out = folder.build;
  }
  
  var page = gulp.src(folder.tmp + '*.html')      

  // minify production code
  if (!devBuild) {
    page = page.pipe(htmlclean());
  }

  return page.pipe(gulp.dest(out));
}));

//  js processes
// compile libraries
gulp.task('libs', function() {

  var jsbuild = gulp.src(folder.src + 'js/scripts/lib/*')
    .pipe(deporder())
    .pipe(concat('libs.js'))
    // .pipe(babel())
    // .pipe(stripdebug())
    .pipe(uglify());

  // move all js scripts over to tmp ahead of next task
  var jsbuild1 = gulp.src(folder.src + 'js/scripts/*')
    .pipe(gulp.dest(folder.tmp + 'js/scripts/'))

  // Add a concatenated libs.js file to the scripts src directory for next 
  return jsbuild.pipe(gulp.dest(folder.tmp + 'js/scripts/'));

});

// compile libraries and then scripts
gulp.task('scripts', gulp.series('libs', function() {
  if (!devBuild) {
    var out = folder.public;
  } else {
    var out = folder.build;
  }

  var jsbuild = gulp.src(folder.tmp + 'js/scripts/*')
    .pipe(deporder())
    .pipe(concat('scripts.js'));

  if (!devBuild) {
    jsbuild = jsbuild
      .pipe(babel())
      .pipe(stripdebug())
      .pipe(uglify());
  }

  return jsbuild.pipe(gulp.dest(out + 'js/'));
}));

gulp.task('js', gulp.series('scripts', function() {
  if (!devBuild) {
    var out = folder.public;
  } else {
    var out = folder.build;
  }

  var file = gulp.src(folder.src + 'js/apps/*')
      // .pipe(newer(out))
      // .pipe(babel())
      // .pipe(stripdebug())
      // .pipe(uglify());

  return file.pipe(gulp.dest(out + 'js'))
}))

// CSS processing
gulp.task('css', gulp.series('images', function() {

  if (!devBuild) {
    var out = folder.public;
  } else {
    var out = folder.build;
  }

  var postCssOpts = [
    assets({ loadPaths: ['images/'] }),
    autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
    mqpacker
  ];

  if (!devBuild) {
    postCssOpts.push(cssnano);
  }

  return gulp.src(folder.src + 'scss/main.scss')
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(out + 'css/'));

}));

// run all tasks
gulp.task('run', gulp.series('html', 'css', 'js'));


// Watch files
function watchFiles() {
    // css changes
  gulp.watch(folder.src + 'scss/**/*', gulp.task('css'));

  // image changes
  gulp.watch(folder.src + 'images/**/*', gulp.task('images'));

  // html changes
  gulp.watch(folder.src + '**/*{.html,.hbs}', gulp.task('html'));

  // javascript changes
  gulp.watch(folder.src + 'js/**/*', gulp.task('js'));

}

gulp.task('watch',watchFiles)