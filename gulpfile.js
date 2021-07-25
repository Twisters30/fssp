let projectFolder = "dist";
let sourceFolder = "#src";

let path = {
    build : {
        html: projectFolder + "/",
        css: projectFolder + "/css/",
        js: projectFolder + "/js",
        img: projectFolder + "/images/",
        fonts: projectFolder + "/fonts/",
    },
    src: {
        html: [sourceFolder + "/*.html", "!" + sourceFolder + "/_*.html"],
        css: sourceFolder + "/scss/style.scss",
        js: sourceFolder + "/js/main.js",
        img: sourceFolder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: sourceFolder + "/fonts/*.{woff,woff2}",
    },
    watch: {
        html: sourceFolder + "/**/*.html",
        css: sourceFolder + "/scss/**/*.scss",
        js: sourceFolder + "/js/**/*.js",
        img: sourceFolder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    // clean: "./" + projectFolder + "/"
}

let { src, dest } = require('gulp');
let gulp = require('gulp');
let browSync = require('browser-sync').create();
let fileInclude = require('gulp-file-include');
// let del = require('del');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer')
// let cleanCss = require('gulp-clean-css');
let rename = require('gulp-rename');
let gcmq = require('gulp-group-css-media-queries');
let uglify = require('gulp-uglify-es').default;
let imagemin = require('gulp-imagemin');
let webp = require('gulp-webp');
let webphtml = require('gulp-webp-html');
// let webpcss = require('gulp-webpcss');
let svgSprite = require('gulp-svg-sprite');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');

let fs = require('fs');

function clean () {
    return del(path.clean)
}

function fonts() {
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
    }

function css() {
    return  src(path.src.css)
        .pipe(
            scss({
                outputStyle: "expanded"
            })
        )
        .pipe(gcmq())
        .pipe(
            autoprefixer({
                overrideBrowserslist: ["last 5 versions"],
                cascade:true
            })
        )
        // .pipe(webpcss())
        .pipe(dest(path.build.css))
        // .pipe(cleanCss())
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browSync.stream())
}

function browserSync() {
    browSync.init({
        server: {
            baseDir: "./" + projectFolder + "/"
        },
        port: 3000,
        notify: false,
        tunnel: true,
        tunnel: "mysite"
    })
}    
function html() {
    return  src(path.src.html)
        .pipe(fileInclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browSync.stream())
}

function images() {
    return  src(path.src.img)
        .pipe(
            webp({
                quality: 80
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3 // 0 to 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browSync.stream())
}

function js() {
    return  src(path.src.js)
        .pipe(fileInclude())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browSync.stream())
}

gulp.task('svgSprite', function() {
    return gulp.src([sourceFolder + '/iconsprite/*.svg'])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite:'../iconsprite/icons.svg',
                    example: true,
                }
            },
        }))
        .pipe(dest(path.build.img))
})

function fontsStyle(params) {

    let file_content = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
    if (file_content == '') {
    fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
    if (items) {
    let c_fontname;
    for (var i = 0; i < items.length; i++) {
    let fontname = items[i].split('.');
    fontname = fontname[0];
    if (c_fontname != fontname) {
    fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
    }
    c_fontname = fontname;
    }
    }
    })
    }
    }
    
    function cb() { }

function watchFiles() {
    gulp.watch([path.watch.html],html)
    gulp.watch([path.watch.css],css)
    gulp.watch([path.watch.js],js)
    gulp.watch([path.watch.img],images)
}
        // clean удалён \/
let build = gulp.series( gulp.parallel(css, js,html,images,fonts),fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;