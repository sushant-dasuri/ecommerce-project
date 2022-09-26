const gulp = require("gulp");
const sass = require("gulp-sass")(require('sass'));
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const merge = require("merge-stream");
const htmlReplace = require("gulp-html-replace");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const autoprefixer = require("gulp-autoprefixer");
const nunjucksRender = require('gulp-nunjucks-render');
const htmlbeautify = require("gulp-html-beautify");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const browserSync = require("browser-sync").create();


//Create paths object
let paths = {
    css: {
        src: 'assets/scss/**/*.scss',
        dest: 'dist/assets/css'
    },

    js: {
        src: 'assets/js/**/*.js',
        dest: 'dist/assets/js'
    },

    html: {
        src: '*.html',
        dest: 'dist'
    },

    image: {
        src: 'assets/img/*{.png,.jpg,.svg}',
        dest: 'dist/assets/img'
    },
    video: {
        src: "assets/video/**/*",
        dest: 'dist/assets/videos'
    },
    favicons: {
        src: "*.ico",
        dest: '/'
    },
    fonts: {
        src: "assets/fonts/**/*",
        dest: 'dist/assets/fonts'
    },
}

//Vendors Array 
let vendors = ["slick-carousel/slick", "font-awesome",  ]

//Clean the dist folder task
function clean (done) {
    return del(["dist/", "assets/css/app.css"])
           done();
}

// COPY THIRD PARTY LIBRARIES FROM NODE_MODULES INTO /VENDOR
function vendorJS() {
    return gulp
                .src([
                    "./node_modules/jquery/dist/*",
                    "!./node_modules/jquery/dist/core.js",
                    "./node_modules/popper.js/dist/umd/popper.*",
                    "./node_modules/bootstrap/dist/js/*",
                    "./node_modules/jquery-validation/dist/jquery.validate.min.js"
                ])
                .pipe(gulp.dest("./assets/js/vendor"));
}

// COPY BOOTSTRAP SCSS(SASS) FROM NODE_MODULES TO /ASSETS/SCSS/BOOTSTRAP
function bootstrapSCSS() {
    return gulp
                .src(["./node_modules/bootstrap/scss/**/*"])
                .pipe(gulp.dest("./assets/scss/bootstrap"))
        
}

function vendorSCSS() {
    return merge(vendors.map(function(vendor){
        return gulp
                .src('./node_modules' + vendor + '/scss/**/*.scss')
                .pipe(gulp.dest("./assets/scss/vendor/" + vendor.replace(/\/.*/, '')));
    }))
}

function vendorFonts() {
    return merge(vendors.map(function(vendor){
        return gulp
                .src('./node_modules' + vendor + '/scss/**/*.scss')
                .pipe(gulp.dest("./assets/fonts/vendor/" + vendor.replace(/\/.*/, '')));
    }))
}

//Vendor CSS build task
const vendorBuild = gulp.series([bootstrapSCSS, vendorSCSS, vendorJS, vendorFonts]);

//Convert SCSS to CSS
function convertSCSS() {
    return gulp.src(paths.css.src)
                .pipe(sourcemaps.init())       
                .pipe(sass
                        .sync({
                            outputStyle: "expanded"
                        })
                        .on('error', sass.logError)
                   )
                .pipe(autoprefixer("last 2 versions"))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest('./assets/css'))
                .pipe(browserSync.reload({
                    stream: true
                }));   
}

//Minify all CSS to dist
function minifyCSS() {
    return gulp.src("./assets/css/app.css")
                .pipe(cleanCSS())
                .pipe(rename({
                    suffix: ".min"
                }))
                .pipe(gulp.dest(paths.css.dest))
                .pipe(browserSync.reload({
                    stream: true
                }));
}

//Minify JS to dist
function minifyJS() {
    return gulp.src("./assets/js/app.js")          
    .pipe(uglify()) 
    .pipe(rename({
        suffix: '.min'
    }))      
    .pipe(gulp.dest(paths.js.dest)) 
    .pipe(browserSync.reload({
        stream: true
    }));

}

//Nunjucks Render
function nunjucks() {
    return gulp.src("pages/**/*.+(html|njk)")
    .pipe(nunjucksRender({
        path: ["template"]
        }))
    .pipe(htmlbeautify({
        "indent_size": 4,
        "indent_char": " "
    }))
    .pipe(gulp.dest("./"))
    .pipe(browserSync.stream());
}

//Add html to dist
function html() {
    return gulp.src(paths.html.src)
                .pipe(gulp.dest(paths.html.dest))
                .pipe(browserSync.reload({
                        stream: true
                }));
}

//Replace html block and copy to dist
function replaceHtml() {
    return gulp.src(paths.html.src)
                .pipe(htmlReplace({
                    js: ["assets/js/app.min.js"],
                    css: ["assets/css/app.min.css"]
                }))
                .pipe(gulp.dest(paths.html.dest))
                .pipe(browserSync.reload({
                        stream: true
                }));

}

//Image Minify
function minifyImage() {
    return gulp.src(paths.image.src)
                .pipe(imagemin())
                .pipe(gulp.dest(paths.image.dest))
                .pipe(browserSync.reload({
                    stream: true
                }));
}

//Copy Remaining Assets
function copyAssets() {
    return gulp.src([ paths.favicons.src, paths.video.src, paths.fonts.src], {
            base: "./"})
        .pipe(gulp.dest("dist/"));
}

//Replace html block and copy to dist
function replaceHTML() {
    return gulp.src(paths.html.src)
    .pipe(htmlReplace({
        css: ["assets/css/app.min.css"],
        js: ["assets/js/app.min.js"]
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.reload({
            stream: true
    }));

}


// BrowserSync + Watch

function watch() {
    browserSync.init({
        server: {
           baseDir: "./",
           index: "./home.html"
        },
        port: 3000
    });
    gulp.watch([paths.css.src], gulp.series(convertSCSS, function cssBrowserReload(done){
            browserSync.reload();
            done();
    }));
    gulp.watch("./assets/js/app.js").on("change", browserSync.reload);
    gulp.watch(["templates/**/*.+(html|njk)", "pages/**/*.+(html|njk)"], gulp.series("nunjucks")).on("change", browserSync.reload);
  
}

//Build task
const build = gulp.series([convertSCSS, minifyCSS, minifyJS, html, nunjucks, replaceHTML, copyAssets]);


//Default task
 exports.default = gulp.series([clean, build]);


exports.build = build;
exports.clean = clean;
exports.watch = watch;
exports.vendorBuild = vendorBuild;
exports.convertSCSS = convertSCSS;
exports.minifyCSS = minifyCSS;
exports.minifyJS = minifyJS;
exports.html = html;
exports.replaceHTML = replaceHTML;
exports.minifyImage = minifyImage;
exports.copyAssets = copyAssets;
exports.nunjucks = nunjucks;