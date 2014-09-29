var gulp = require('gulp'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	minifyCSS = require('gulp-minify-css'),
	browserSync = require('browser-sync');

var path = {
	app : "./app",
	pub : "./_public"
};

gulp.task('jade', function(){
	return gulp.src(path.app + '/*.jade')
		.pipe(jade({
			pretty: true
		}))
		.pipe(gulp.dest(path.pub + '/'));
});

gulp.task('css', function(){
	return gulp.src(path.app + '/assets/scss/style.scss')
		.pipe(sass())
		.pipe(autoprefixer('last 4 version'))
		.pipe(gulp.dest(path.pub + '/css/'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function(){
	return gulp.src(path.app + '/assets/js/scripts.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.pub + '/js/'))
		.pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('vendorJS', function() {
	return gulp.src(path.app + '/assets/vendor/**/*.js')
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.pub + '/js/'))
		.pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('vendorCSS', function() {
	return gulp.src(path.app + '/assets/vendor/**/*.css')
		.pipe(concat('vendor.css'))
		.pipe(minifyCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.pub + '/css/'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('browser-sync', function() {
    return browserSync({
    	server: {
    		baseDir: path.pub	
    	}
    });
});

gulp.task('default', ['jade', 'css', 'js', 'vendorCSS', 'vendorJS', 'browser-sync'], function(){
	gulp.watch(path.app + '/**/*.jade', ['jade', browserSync.reload]);
	gulp.watch(path.app + '/assets/scss/**/*.scss', ['css']);
	gulp.watch(path.app + '/assets/js/script.js', ['js']);
	gulp.watch(path.app + '/assets/vendor/**/*.js', ['vendorJS']);
	gulp.watch(path.app + '/assets/vendor/**/*.css', ['vendorCSS']);
});







