// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
	htmlclean = require('gulp-htmlclean'),
	concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  babel = require("gulp-babel"),
  uglify = require('gulp-uglify'),
 	sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),
	hb = require('gulp-hb'),
	frontMatter = require('gulp-front-matter');

  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // for testing the production build, do this
  // devBuild = (process.env.NODE_ENV === 'production'),

  // folders
  folder = {
    src: 'src/',
    build: 'build/',
    tmp: 'tmp/'
  }
;

// image processing
gulp.task('images', function() {
  var out = folder.build + 'images/';
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
            // .helpers('./src/assets/helpers/*.js')
            // .data('./src/assets/data/**/*.{js,json}')
        )

        .pipe(gulp.dest('tmp'));
}

gulp.task('inject', inject);

// html process
gulp.task('html', gulp.series('inject','images', function() {
  var
    out = folder.build,
    page = gulp.src(folder.tmp + '*.html')      

  // minify production code
  if (!devBuild) {
    page = page.pipe(htmlclean());
  }

  return page.pipe(gulp.dest(out));
}));

//  js processes
// compile libraries
gulp.task('libs', function() {

  var jsbuild = gulp.src(folder.src + 'js/utils/lib/*')
    .pipe(deporder())
    .pipe(concat('libs.js'))
  	// .pipe(babel())
    // .pipe(stripdebug())
    .pipe(uglify());

  // Add a concatenated libs.js file to the utils src directory for next 
  return jsbuild.pipe(gulp.dest(folder.tmp + 'js/utils/'));

});

// compile libraries and then scripts
gulp.task('utils', gulp.series('libs', function() {

  var jsbuild = gulp.src(folder.tmp + 'js/utils/*')
    .pipe(deporder())
    .pipe(concat('utils.js'));

  if (!devBuild) {
    jsbuild = jsbuild
	    .pipe(babel())
      .pipe(stripdebug())
      .pipe(uglify());
  }

  return jsbuild.pipe(gulp.dest(folder.build + 'js/'));
}));

gulp.task('js', gulp.series('utils', function() {
	var
	  out = folder.build + 'js/',
	  file = gulp.src(folder.src + 'js/apps/*')
      // .pipe(newer(out))
      // .pipe(babel())
      // .pipe(stripdebug())
      // .pipe(uglify());

	return file.pipe(gulp.dest(out))
}))

// CSS processing
gulp.task('css', gulp.series('images', function() {

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
    .pipe(gulp.dest(folder.build + 'css/'));

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
  gulp.watch(folder.src + 'html/**/*', gulp.task('html'));

  // javascript changes
  gulp.watch(folder.src + 'js/**/*', gulp.task('js'));

}


gulp.task('watch',watchFiles)

