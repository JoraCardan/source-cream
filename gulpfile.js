var 
	gulp = require('gulp'),
	watch = require('gulp-watch'),
	jade = require('gulp-jade'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	minifyCSS = require('gulp-minify-css'),
	gutil = require('gulp-util'),
	plumber = require('gulp-plumber'),
	browserSync = require('browser-sync')
;

var path = {
	app : "app",
	pub : "./_public"
};

var plumberError = function (err) {
    gutil.beep();
    console.error(err.message);
};

gulp.task('jade', function(){

	return watch(path.app + '/**/*.jade', function() {
		gulp.src(path.app + '/*.jade')
			.pipe(plumber(function (error) {
				plumberError(error);
				this.emit('end');
			}))
			.pipe(jade({
				pretty: true
			}))
			.pipe(gulp.dest(path.pub + '/'))
			.pipe(browserSync.reload({stream:true}));
	});
});

gulp.task('css:main', function(){

	return watch(path.app + '/assets/scss/**/*.scss', function() {
		gulp.src(path.app + '/assets/scss/style.scss')
			.pipe(plumber(function (error) {
				plumberError(error);
				this.emit('end');
			}))
			.pipe(sass())
			.pipe(autoprefixer('last 4 version'))
			.pipe(gulp.dest(path.pub + '/css/'))
			.pipe(browserSync.reload({stream:true}));
	});
});

gulp.task('css:vendor', function() {
	return gulp.src(path.app + '/assets/vendor/**/*.css')
		.pipe(concat('vendor.css'))
		.pipe(minifyCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.pub + '/css/'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('js:main', function(){
	// Except jQuery.js file 
	return gulp.src(path.app + '/assets/js/scripts.js')
		.pipe(plumber(function (error) {
			plumberError(error);
			this.emit('end');
		}))
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(gulp.dest(path.pub + '/js/'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.pub + '/js/'))
		.pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('js:vendor', function() {
	return gulp.src([path.app + '/assets/vendor/**/*.js', '!' + path.app + '/assets/vendor/js/jquery.js'])
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(path.pub + '/js/'))
		.pipe(browserSync.reload({stream:true, once: true}));
});


gulp.task('browserReload', function() {
	return browserSync.reload();
});

gulp.task('browser-sync', function() {
    return browserSync({
    	server: {
    		baseDir: path.pub	
    	}
    });
});

gulp.task('js:jqueryPrepare', function() {
    return gulp.src(path.app + '/assets/vendor/js/jquery.js')
    	.pipe(uglify())
    	.pipe(rename({suffix: '.min'}))
    	.pipe(gulp.dest(path.pub + '/js/'));
});

gulp.task('default', ['jade', 'css:main', 'js:main', 'css:vendor', 'js:vendor', 'browser-sync'], function(){
	gulp.watch(path.app + '/assets/js/scripts.js', ['js']);
	gulp.watch(path.app + '/assets/vendor/**/*.js', ['vendorJS']);
	gulp.watch(path.app + '/assets/vendor/**/*.css', ['vendorCSS']);
});








