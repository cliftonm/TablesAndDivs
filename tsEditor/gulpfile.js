var gulp = require('gulp');
// var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var tsify = require('tsify');
var fancy_log = require('fancy-log');
var paths = {
    pages: [
        'src/*.html', 
        'src/*.css'
    ]
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,        // Setting to false removes the source mapping data.
    entries: [
        // TS files to transpile and bundle.
        'src/app.ts',
        'src/eventHandlers.ts',
        'src/helpers.ts',
        'src/initializer.ts',
        'src/main.ts'
    ],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task('copy-html', function () {
    return gulp.src(paths.pages)
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .on('error', fancy_log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
}

gulp.task('default', gulp.series(gulp.parallel('copy-html'), bundle));
watchedBrowserify.on('update', bundle);
watchedBrowserify.on('log', fancy_log);
