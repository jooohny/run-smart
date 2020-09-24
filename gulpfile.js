const { src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const groupMediaQueries = require('gulp-group-css-media-queries');
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html');
const webpcss = require('gulp-webp-css');
const postcss = require('gulp-postcss');

const sourceFolder = 'src';
const distFolder = 'dist';

const path = {
    src: {
        html: sourceFolder,
        css: sourceFolder + '/css',
        fonts: sourceFolder + '/fonts',
        icons: sourceFolder + '/icons',
        img: sourceFolder + '/img',
        js: sourceFolder + '/js',
        sass: sourceFolder + '/sass'
    },
    build: {
        html: distFolder,
        css: distFolder + '/css',
        fonts: distFolder + '/fonts',
        icons: distFolder + '/icons',
        img: distFolder + '/img',
        js: distFolder + '/js',
    },
    watch: {
        html: sourceFolder + '/index.html',
        css: sourceFolder + '/css/**/*.css',
        js: sourceFolder + '/js/**/*.js',
        sass: sourceFolder + '/sass/**/*.scss'      
    },
}

function server() {
    browserSync.init({
        server: {
            baseDir: "dist",
        },
        host: "192.168.1.1",
        port: 3030,
    });
}


function deleteDist() {
    return del(distFolder);
}

function html() {
    return src(path.src.html + '/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(webphtml())
    .pipe(dest(path.build.html));
}

function compileSASS () {
    return src(path.src.sass + '/style.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(dest(path.src.css));    
}

function handleCSS() {
    return src(path.src.css + '/**/*.css')
        .pipe(concat('style.css'))
        .pipe(webpcss())
        .pipe(postcss())
        .pipe(groupMediaQueries())
        .pipe(autoprefixer({
            cascade: false,
        }))
        .pipe(dest(path.build.css))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream());    ;
}

function fonts() {
    return src(path.src.fonts + '/*.{eot,ttf,woff}')
        .pipe(dest(path.build.fonts));
}

function icons() {
    return src(path.src.icons + '/**/*.{jpg,png,ico,svg,gif,webp}')
        .pipe(webp({
            quality: 80,
        }))
        .pipe(dest(path.build.icons))
        .pipe(src(path.src.icons + '/**/*.{jpg,png,ico,svg,gif,webp}'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: true }],
            interplaced: true,
            optimizationLevel: 3, // 0 to 7
        }))
        .pipe(dest(path.build.icons));
}

function img() {
    return src(path.src.img + '/**/*.{jpg,png,ico,svg,gif,webp}')
        .pipe(webp({
            quality: 80,
        }))
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img + '/**/*.{jpg,png,ico,svg,gif,webp}'))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: true }],
            interplaced: true,
            optimizationLevel: 3, // 0 to 7
        }))
        .pipe(dest(path.build.img));
}

function js() {
    return src(path.src.js  + '/**/*.js')
        .pipe(dest(path.build.js));
}

const css = series(compileSASS, handleCSS);
const build = series(deleteDist, parallel(html, css, fonts, icons, img, js));

function watchFiles() {
    watch([path.watch.sass], compileSASS);
    watch([path.watch.css], handleCSS);
    watch([path.watch.html]).on('change', series(html, browserSync.reload));
    watch([path.watch.js]).on('change', series(js, browserSync.reload));
}

exports.server = server;
exports.css = css;
exports.watchFiles = watchFiles;
exports.default = series(build, parallel(watchFiles, server));

