var gulp = require('gulp'),
    htmlbeautify = require('gulp-html-beautify'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css'),
    runTimestamp = Math.round(Date.now() / 1000),
    fontName = 'Icons',
    pleeease = require('gulp-pleeease'),
    sass = require('gulp-sass'),
    compass = require('compass-importer'),
    zip = require('gulp-zip'),
    data = require('gulp-data'),
    twig = require('gulp-twig'),
    favicons = require('gulp-favicons'),
    browserSync = require('browser-sync'),
    taskListing = require('gulp-task-listing'),
    fs = require('fs'),
    gutil = require("gulp-util"),
    runSequence = require('run-sequence'),
    del = require('del'),
    sftp = require('gulp-sftp'),
    dateFormat = require('dateformat'),
    csscomb = require('gulp-csscomb'),
    sourcemaps = require('gulp-sourcemaps'),
    jsonServer = require("gulp-json-srv"),
    jsonSrv = jsonServer.create({
      port: 3007,
      id: "identifiant"

    });

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');
var webpackRun = webpack(webpackConfig);


/* Webpack */
gulp.task('webpack', function() {
  webpackRun.run(function(err, stats) {
    if(err) {
      console.log('Error', err);
    }
    else {
      console.log(stats.toString());
    }
  });
    return gulp.src(['./dist/**/*'])
        .pipe(browserSync.reload({
            stream: true
        }));
});

var doSftp = function () {
    return gutil.noop();
    return sftp({
        host: "webq.fr",
        user: "tibolan",
        pass: 'zdgswnn1606',
        remotePath: '/var/www/FFT-ADOC'
    })
}



/* FAVICON */
gulp.task('favicon', function () {
    gulp.src("src/img/favicon/logo.png").pipe(favicons({
        appName: "FFT2017",                  // Your application's name. `string`
        appDescription: "FFT website",           // Your application's description. `string`
        developerName: "tibolan",            // Your (or your developer's) name. `string`
        developerURL: "tibolan@gmail.com",             // Your (or your developer's) URL. `string`
        background: "#fff",             // Background colour for flattened icons. `string`
        theme_color: "#fff",
        background: "#facade",
        path: "favicons/",
        display: "standalone",
        orientation: "portrait",
        start_url: "/?homescreen=1",
        version: 1.0,
        logging: false,
        online: false,
        html: "../../src/pages/inc/favicon.html",
        pipeHTML: true,
        replace: true,
        icons: {
            // Platform Options:
            // - offset - offset in percentage
            // - shadow - drop shadow for Android icons, available online only
            // - background:
            //   * false - use default
            //   * true - force use default, e.g. set background for Android icons
            //   * color - set background for the specified icons
            //
            android: false,              // Create Android homescreen icon. `boolean` or `{ offset, background, shadow }`
            appleIcon: false,            // Create Apple touch icons. `boolean` or `{ offset, background }`
            appleStartup: false,         // Create Apple startup images. `boolean` or `{ offset, background }`
            coast: false,      // Create Opera Coast icon with offset 25%. `boolean` or `{ offset, background }`
            favicons: true,             // Create regular favicons. `boolean`
            firefox: false,              // Create Firefox OS icons. `boolean` or `{ offset, background }`
            windows: false,              // Create Windows 8 tile icons. `boolean` or `{ background }`
            yandex: false                // Create Yandex browser icon. `boolean` or `{ background }`
        }
    }))
        .on("error", gutil.log)
        .pipe(gulp.dest("./dist/favicons"));
});

/* *.txt files */
gulp.task("txt", function () {
    gulp.src(["./src/*.txt", "./src/.htaccess"])
        .pipe(gulp.dest("./dist"));
});


gulp.task("css_preprocess", function () {
    return gulp.src(['./src/scss/fft.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({ importer: compass }).on('error', sass.logError))
        .pipe(pleeease({
            autoprefixer: {"cascade": false, "browsers": ["last 3 versions"]},
            minifier: false,
            opacity: false,
            filters: false,
            rem: true,
            pseudoElements: true,
            sourcemaps: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
});
gulp.task("css_postprocess", function () {
    return gulp.src('./dist/css/*.css')
        .pipe(csscomb(
            {
                "remove-empty-rulesets": true,
                "always-semicolon": true,
                "color-case": "lower",
                "block-indent": "    ",
                "color-shorthand": true,
                "element-case": "lower",
                "eof-newline": true,
                "leading-zero": true,
                "quotes": "double",
                "sort-order-fallback": "abc",
                "space-before-colon": " ",
                "space-after-colon": " ",
                "space-before-combinator": " ",
                "space-after-combinator": " ",
                "space-between-declarations": "\n",
                "space-before-opening-brace": " ",
                "space-after-opening-brace": "\n",
                "space-after-selector-delimiter": "\n",
                "space-before-selector-delimiter": "",
                "space-before-closing-brace": "\n",
                "strip-spaces": true,
                "tab-size": true,
                "vendor-prefix-align": true
            }
        ))
        .pipe(gulp.dest('./dist/css'))
});

gulp.task("refresh_browser", function () {
    return gulp.src(['./dist/**/*'])
        .pipe(browserSync.reload({
            stream: true
        }));
});


/* CSS */
gulp.task('css', function (cb) {
    runSequence('css_preprocess',
                'legacy-css',
        'refresh_browser',
        cb
    )

});

/* IMG */
gulp.task('legacy-css', function () {
    return gulp.src('./src/css/*.*')
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});


/* IMG */
gulp.task('image', function () {
    return gulp.src('./src/img/*.*')
        .pipe(gulp.dest('./dist/img'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('js', function () {
    return gulp.src(['./src/js/**/*', '!./src/js/app','!./src/js/app/**'])
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.reload({
            stream: true,
            minifier: false
        }));
});

gulp.task('jsonDB', function () {
  return gulp.src('./src/json/db.json')
    .pipe(gulp.dest('./dist/json'))
    .pipe(jsonSrv.pipe());
});
gulp.task('json', function () {
  return gulp.src('./src/json/montastruc.json')
    .pipe(gulp.dest('./dist/json'))
    .pipe(jsonSrv.pipe());
});
gulp.task('jsonsssss', function (callback) {
  runSequence('jsonDB',
    'jsonClub',
    callback);

});
/* TWIG */
gulp.task('twig', function () {
    var filename;
    gulp.src("./src/pages/*.twig")
        .pipe(data(function (file) {
          filename = file.path.match("([^/]+?).twig$", "g")[1];
          return JSON.parse(fs.readFileSync('./src/i18n/' + 'fr' + '.json'));
        }))
        .pipe(twig())
        .pipe(htmlbeautify({
            indentSize: 4
        }))
        .pipe(gulp.dest("./dist"))
        .pipe(browserSync.reload({
            stream: true
        }))
});


/* WATCHER */
gulp.task('watch', function () {
    gulp.watch('src/**/*.twig', ['twig']);
    gulp.watch('src/scss/**/*.scss', ['css']);
    gulp.watch('src/img/*', ['image']);
    gulp.watch(['src/js/**/*', '!src/js/app','!src/js/app/**'], ['js']);
    gulp.watch('src/js/app/**/*.js', ['webpack'])
    gulp.watch('src/js/app/**/*.vue', ['webpack'])
});


gulp.task('server', function () {
    browserSync({
        server: {
            baseDir: 'dist'
        }
    });
});

/* DEV MODE */
gulp.task('dev', function (callback) {
    runSequence('build',
        'server',
        'watch',
        callback);

});

/* BUILD DIST */
gulp.task('build', function (callback) {
    runSequence(
        'favicon',
        ['twig',  'image', 'js'],
        'css',
        'webpack',
        callback);
});

gulp.task('build-prod', function (callback) {
    runSequence(
        'favicon',
        ['twig', 'image', 'js'],
        'css',
        callback);
});

/* BUILD DIST */
gulp.task('build-full', function (callback) {
    runSequence(
        'clean',
        'favicon',
        'txt',
        'build',
        callback);
});


gulp.task('clean', function (callback) {
    return del('./dist/*')
});


/* ZIP */
gulp.task('zip', ['build'], function () {
    console.log(dateFormat(Date.now(), "dd-mm-yy"));
    gulp.src('./dist/**/*')
        .pipe(zip('export_' + dateFormat(Date.now(), "dd-mm-yy") + '.zip'))
        .pipe(gulp.dest('.'))
});


gulp.task("ftp", function () {
    gulp.src("./dist/**/*")
        .pipe(sftp({
            host: '',
            user: '',
            pass: '',
            remotePath: ''
        }))
        .pipe(gutil.noop());
});

/* TASKLIST */
gulp.task('default', function () {
    console.log('Plz pick one:');
    taskListing(null, 'zip/');
});
