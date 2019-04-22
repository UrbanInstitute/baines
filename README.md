## The Urban Institute's Baines Rig

### rough getting started guide

* clone this repo
* run `npm install`
* change name/details inside package.json
* modify github remote accordingly


### Available commands

See gulpfile.js for full list of tasks

`gulp run` will compile everything

`gulp watch` will watch for changes

In order to compile the `public/` folder, set the node environment to production by entering the following:

`export NODE_ENV=production`

Then run `gulp run` and check that the `build/` folder looks correct.

*Note! Each time you restart your terminal your NODE_ENV will reset*

### Modifying and adjusting for your needs

- adjust available browsers to compile to at the bottom of the package.json (see Browserslist for more info)


### Tools and Resources
Getting started, I followed [this tutorial](https://www.sitepoint.com/introduction-gulp-js/) but note that it is run with Gulp 3.x, and not 4.x. The substantive differences are in the following items:

- The way serieses of tasks were called changed in v4. [See here for more info](https://gulpjs.com/docs/en/api/series)


HTML templating and precompile injection: [Gulp-hb](https://github.com/shannonmoeller/gulp-hb#file-specific-data-sources)

- [Handlebars API](http://handlebarsjs.com/)

Transpiling: Babel and Browserslist

- [Babel preset-env](https://babeljs.io/docs/en/babel-preset-env)
- [Browserslist](https://github.com/browserslist/browserslist)

Ordering of JS

- [deporder](https://www.npmjs.com/package/gulp-deporder): this allows us to order the js without using imports/require statements.




### Needed improvements

- Continuous integration 
- Pym.js support
- More sophisticated require or webpack type js management
- more sophisticated html template/partial injection with conditionals, a la nunjucks
