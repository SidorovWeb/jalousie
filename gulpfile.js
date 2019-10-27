var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	sassGlob = require('gulp-sass-glob'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	fs = require('fs'),
	pug = require('gulp-pug'),
	del = require('del'),
	sourcemaps = require('gulp-sourcemaps'),
	imagemin = require('gulp-imagemin'),
	plumber = require('gulp-plumber'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	ftp = require('vinyl-ftp'),
	notify = require("gulp-notify"),
	svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	cssunit = require('gulp-css-unit'),
	replace = require('gulp-replace'),
	rsync = require('gulp-rsync');
gcmq = require('gulp-group-css-media-queries');
babel = require('gulp-babel');

// BROWSER-SYNC
gulp.task('browser-sync', function () {
	browserSync({
		browser: 'google chrome',
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
	});
});

// gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
// 	gulp.watch('app/pug/**/*.pug', ['html']);
// 	gulp.watch('app/scss/**/*.scss', ['sass']);
// 	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
// 	gulp.watch('app/*.html', browserSync.reload);
// });
gulp.task('watch', function () {
	gulp.watch('app/pug/**/*.pug', gulp.parallel('html'));
	gulp.watch('app/scss/**/*.scss', gulp.parallel('sass'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js'));
	gulp.watch('app/*.html', browserSync.reload);
});

// PUG
gulp.task('html', function () {
	return gulp.src('app/pug/pages/*.pug')
		.pipe(plumber())
		.pipe(pug({
			locals: JSON.parse(fs.readFileSync('./data/content.json', 'utf8')),
			pretty: true
		}))
		.pipe(gulp.dest('app'))
		.pipe(browserSync.stream());
});

// SASS
gulp.task('sass', function () {
	return gulp.src('app/scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sassGlob())
		.pipe(plumber())
		.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(autoprefixer(['last 3 versions']))
		.pipe(gcmq())
		.pipe(cssunit({
			type: 'px-to-rem',
			rootSize: 16
		}))
		.pipe(cleanCSS()) // Опционально, закомментировать при отладке
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({ stream: true }));
});

// JS
gulp.task('common-js', function () {
	return gulp.src([
		'app/js/common.js',
	])
		.pipe(plumber())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('common.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

// ПОДКЛЮЧЕНИЕ БИБЛИОТЕК jS
gulp.task('js', gulp.parallel('common-js'), function () {
	return gulp
		.src([
			"app/libs/jquery/jquery.min.js",
			"app/libs/svg4everybody/svg4everybody.js",
			"app/libs/SliderSlick/slick.min.js",
			"app/libs/masked/masked.js",
			"app/libs/magnific-popup/jquery.magnific-popup.min.js",
			"app/libs/audioplayer/audioplayer.js",
			"app/js/common.min.js" // Всегда в конце
		])
		.pipe(concat("scripts.min.js"))
		.pipe(uglify()) // Минимизировать весь js (на выбор)
		.pipe(gulp.dest("app/js"))
		.pipe(browserSync.reload({ stream: true }));
});

// IMG
gulp.task('imagemin', function () {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin())) // Cache Images
		.pipe(gulp.dest('dist/img'));
});

// SVG
var config = {
	mode: {
		symbol: {
			sprite: "../sprite.svg",
			render: {
				scss: {
					dest: '../../../scss/spriteSVG/_sprite.scss'
				}
			}
		}
	}
};

gulp.task('svgSpriteBuild', function () {
	return gulp.src('app/img/i/*.svg')
		// минифицируем svg
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		// удалить все атрибуты fill, style and stroke в фигурах
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: { xmlMode: true }
		}))
		// cheerio плагин заменит, если появилась, скобка '&gt;', на нормальную.
		.pipe(replace('&gt;', '>'))
		// build svg sprite
		.pipe(svgSprite(config))
		.pipe(gulp.dest('app/img/sprite/'));
});
// gulp.task('removedist', function () { return del('dist'); });



gulp.task('buildFiles', () => {
	return gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
})
gulp.task('buildCss', () => {
	return gulp.src('app/css/main.min.css',
	).pipe(gulp.dest('dist/css'));
})
gulp.task('buildJs', () => {
	return gulp.src(
		'app/js/scripts.min.js',
	).pipe(gulp.dest('dist/js'));
})
gulp.task('buildFonts', () => {
	return gulp.src(
		'app/fonts/**/*',
	).pipe(gulp.dest('dist/fonts'));
})
gulp.task('buildAudio', () => {
	return gulp.src(
		'app/audio/**/*',
	).pipe(gulp.dest('dist/audio'));
})
gulp.task('buildSvg', () => {
	return gulp.src(
		'app/img/sprite/*',
	).pipe(gulp.dest('dist/img/sprite'));
})

// СБОР
gulp.task('build', gulp.parallel('imagemin', 'sass', 'js', 'buildFiles',
	'buildCss',
	'buildJs',
	'buildFonts',
	'buildAudio',
	'buildSvg')),
	gulp.task('deploy', function () {

		var conn = ftp.create({
			host: 'hostname.com',
			user: 'username',
			password: 'userpassword',
			parallel: 10,
			log: gutil.log
		});

		var globs = [
			'dist/**',
			'dist/.htaccess',
		];
		return gulp.src(globs, { buffer: false })
			.pipe(conn.dest('/path/to/folder/on/server'));

	});

gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', gulp.parallel('watch', 'sass', 'js', 'browser-sync'));
