## Baines

A gulp flavored build tool for quick and modular charts, features, and pym iframes.

![](https://cdn.theatlantic.com/assets/media/img/mt/2018/08/GettyImages_615297724/lead_720_405.jpg?mod=1535079025)

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

Then run `gulp run` and check that the `public/` folder looks correct.

*Note! Each time you restart your terminal your NODE_ENV will reset*

After this, if you want to push to the gh-pages branch use the following command:

`git add public && git commit -m "Some commit message"`
`git subtree push --prefix public origin gh-pages`

cf: https://gist.github.com/cobyism/4730490

### Modifying and adjusting for your needs

- adjust available browsers to compile to at the bottom of the package.json (see Browserslist for more info)


### Tools and Resources
Getting started, I followed [this tutorial](https://www.sitepoint.com/introduction-gulp-js/) but note that it is run with Gulp 3.x, and not 4.x. The substantive differences are in the following items:

- The way serieses of tasks were called changed in v4. [See here for more info](https://gulpjs.com/docs/en/api/series)


HTML templating and precompile injection: [Gulp-hb](https://github.com/shannonmoeller/gulp-hb#file-specific-data-sources)

- [Handlebars API](http://handlebarsjs.com/), including [this helper](https://code-maven.com/handlebars-conditionals)


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