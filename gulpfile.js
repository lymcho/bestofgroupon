var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var uglify = require('gulp-uglify');
var pump = require('pump');


//-------tasks---------------------------------------
//1.sass to css conversion task
gulp.task('sass', function(){
	//the"return here means we want to run this first
	return gulp.src('app/sass/*.sass')
		.pipe(sass())//using gulp-sass
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}))
});
//2.browser sync task
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir:'app'
		},
	})
});
//3.image task
gulp.task('image', function(){
	gulp.src('app/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('build/images'))
});
//4.auto-prefix browser for css
gulp.task('prefix', function(){
    gulp.src('app/css/*')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/css'))
});
//4.1 mimify index.html
gulp.task('indexhtmlmin', function() {
  return gulp.src('app/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/'));
});
//4.2 mimify all other htmls
gulp.task('allhtmlmin', function() {
  return gulp.src('app/html/*')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/html'));
});

//5.minimizejs
gulp.task('uglify', function (cb) {
  pump([
        gulp.src('app/js/*'),
        uglify(),
        gulp.dest('build/js')
    ],
    cb
  );
});
//-------watch---------------------------------------
//watch all file conversion tasks - usuallly in app folder
//making sure ]browser sync & sass] already runs before running watch
gulp.task('watch', ['browserSync','sass'], function(){
	//watch for sass conversions
	gulp.watch('app/sass/*.sass',['sass']);
	//other watches
	//reload the browser whenever html & js files change
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/*.js', browserSync.reload);
	
});




//-------deployment-------------------------------------
gulp.task('deploy', ['sass', 'image', 'prefix','indexhtmlmin','allhtmlmin','uglify']);





