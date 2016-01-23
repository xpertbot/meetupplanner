var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	notify = require('gulp-notify'),
	livereload = require('gulp-livereload'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass');

var PATH = 'public_html/';

gulp.task('sass', function(){
	return gulp.src('sass/main.scss')
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
		.pipe(livereload());
});

// gulp.task('js', function(){
// 	return gulp.src('assets/js/main.js')
// 		.pipe(concat('main.min.js'))
// 		.pipe(uglify())
// 		.pipe(gulp.dest(PATH+'js'))
// 		.pipe(livereload());
// });

gulp.task('default', ['sass'], function(){
	livereload.listen();
	gulp.watch('sass/main.scss', ['sass']);
	// gulp.watch('assets/js/*.js', ['js']);
});
