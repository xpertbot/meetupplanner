var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	htmlmin = require('gulp-htmlmin'),
	notify = require('gulp-notify'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync'),
	modRewrite = require('connect-modrewrite'),
	sass = require('gulp-sass');

var PATH = 'public_html/';

gulp.task('sass', function(){
	return gulp.src('src/sass/main.scss')
		.pipe(sass({
			outputStyle:'compressed'
		}))
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(rename({suffix:'.min'}))
		.pipe(gulp.dest(PATH+'css/'))
		.pipe(browserSync.stream());
});

gulp.task('js', function(){
	return gulp.src('src/js/main.js')
		.pipe(uglify())
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(rename({suffix:'.min'}))
		.pipe(gulp.dest(PATH+'js'))
		.pipe(browserSync.stream());
});

gulp.task('html', function(){
	return gulp.src('src/html/**/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(gulp.dest(PATH))
});

gulp.task("serve",['sass', 'js', 'html'], function(){
	browserSync.init({
		server: {
			baseDir: "./public_html",
          	middleware: [
        		modRewrite(['^([^.]+)$ /index.html [L]'])
          	]
		}
	});

	gulp.watch('src/sass/main.scss', ['sass']);
	gulp.watch('src/js/main.js', ['js']);
	gulp.watch('src/**/*.html', ['html']).on("change", browserSync.reload);
});

gulp.task('default', ['serve']);
