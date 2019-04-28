// Gulp.js configuration

  // modules
const gulp = require('gulp');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const htmlclean = require('gulp-htmlclean');
const concat = require('gulp-concat');
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
const include = require('gulp-include');
const del = require('del');
const colors = require('colors');


let devBuild = true;

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

  // minify production code for html...turned off by default
  // if (!devBuild) {
  //   page = page.pipe(htmlclean());
  // }

  return page.pipe(gulp.dest(out));
}));

gulp.task('js', function() {
  if (!devBuild) {
    var out = folder.public;
  } else {
    var out = folder.build;
  }

  var file = gulp.src(folder.src + 'js/*')
    .pipe(include()) 
      

  if (!devBuild) {
    file = file
      .pipe(babel())
      .pipe(stripdebug())
      .pipe(uglify());
  }

  return file.pipe(gulp.dest(out + 'js'))
})

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

gulp.task('cleanBuild', function () {

  if (!devBuild) {
    var out = folder.public;
  } else {
    var out = folder.build;
  }

  return del([
    out
  ]);
});

gulp.task('cleanTemp', function () {

  return del([
    '.tmp/'
  ]);
});

gulp.task("warn", function(done){

let hat = 
  "             .~~~~`\\~~\\\n"+
  "            ;       ~~ \\\n"+
  "            |           ;\n"+
  "        ,--------,______|---.\n"+
  "       /          \\-----`    \\\n"+
  "       `.__________`-_______-'\n";

  let rose = 
"                     _   / /|           ".green  + "           \n".yellow +
"                    |\\\\  \\/_/        ".green  + "              \n".yellow +
"                    \\_\\| / __         ".green  + "             \n".yellow +
"                       \\/_/__\\        ".green  + "   .-=='/~\\  \n".yellow +
"                ____,__/__,_____,______)".green  + "/   /{~}}} \n".yellow +
"                -,------,----,-----,---,".green  + "\\'-' {{~}} \n".yellow;
  
let message,
    roseTip,
    messageNext,
    before;

  if (!devBuild) {
    roseTip = "                    '-==.\\}/  \n".yellow;
    before = rose;
    messageNext =
    "\n🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩\n" +
    `🐩\t\t\t\t\t\t\t\t  🐩\n🐩 \trunning public build, sending to ${folder.public}. Giddyup\t  🐩\n🐩\t\t\t\t\t\t\t\t  🐩\n` +
    "🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩 🐩\n";

  } else {
    roseTip = "\n"
    before = hat;
    messageNext =
    "\n🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈\n" +
    `🙈\t\t\t\t\t\t\t\t  🙈\n🙈  \trunning development build, sending to ${folder.build}. Giddyup\t  🙈\n🙈\t\t\t\t\t\t\t\t  🙈\n` +
    "🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈 🙈\n";
  }

  let intro = `\nHowdy! Welcome to...\t\t\n\n`

  let name =
  "               "        +`🤠🤠🤠🤠🤠🤠`+ roseTip +
  "               "        +`🤠     🤠   🤠🤠   🤠 🤠    🤠 🤠🤠🤠🤠🤠🤠  🤠🤠🤠🤠  ` + "               \n" +
  "   _____,,;;;`;".white  +`🤠     🤠  🤠  🤠  🤠 🤠🤠   🤠 🤠      🤠      ` + ";';;;,,_____ \n".white +
  ",~(  )  , )~~\\|".white +`🤠🤠🤠🤠🤠🤠  🤠    🤠 🤠 🤠 🤠  🤠 🤠🤠🤠🤠🤠   🤠🤠🤠🤠  ` + "|/~~( ,  (  )~; \n".white +
  "' / / --`--,   ".white  +`🤠     🤠 🤠🤠🤠🤠🤠🤠 🤠 🤠  🤠 🤠 🤠           🤠 ` + "   .--'-- \\ \\ ` \n".white +
  " /  \\    | '   ".white +`🤠     🤠 🤠    🤠 🤠 🤠   🤠🤠 🤠      🤠    🤠 ` + "   ` |    /  \\ \n".white +
  "               "        +`🤠🤠🤠🤠🤠🤠  🤠    🤠 🤠 🤠    🤠 🤠🤠🤠🤠🤠🤠  🤠🤠🤠🤠  ` + "               \n"

  message = intro+before+name  + messageNext;

  console.log(message)
  done();
})

gulp.task("setEnviro", function(done){  
  devBuild = false;

  done();
})

// run all tasks
gulp.task('run', gulp.series('warn','cleanBuild','cleanTemp','html', 'css', 'js','cleanTemp'));

gulp.task('deploy', gulp.series('setEnviro','warn','cleanBuild','cleanTemp','html', 'css', 'js','cleanTemp'));


// Watch files
function watchFiles() {

  // development
  devBuild = true;

    // css changes
  gulp.watch(folder.src + 'scss/**/*', gulp.task('css'));

  // image changes
  gulp.watch(folder.src + 'images/**/*', gulp.task('images'));

  // html changes
  gulp.watch(folder.src + '**/*{.html,.hbs}', gulp.task('html'));

  // javascript changes
  gulp.watch(folder.src + 'js/**/*', gulp.task('js'));

}

gulp.task('watch',gulp.series('warn',watchFiles));
