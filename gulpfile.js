'use strict';
var gulp = require('gulp');
var bump = require('gulp-bump');
var { execSync } = require('child_process');

// 更新预发布版本号, 开发中版本, 可能会有较大改动.
gulp.task('version-prerelease', () => {
    return gulp.src('./package.json')
        .pipe(bump({
            type: 'prerelease'
        }))
        .pipe(gulp.dest('./'));
});
// 更新 Z 版本号, 修复bug, 兼容老版本
gulp.task('version-patch', () => {
    return gulp.src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(gulp.dest('./'));
});
// 更新 Y 版本号, 兼容老版本
gulp.task('version-minor', () => {
    return gulp.src('./package.json')
        .pipe(bump({
            type: 'minor'
        }))
        .pipe(gulp.dest('./'));
});
// 更新 X 版本号, 不兼容老版本
gulp.task('version-major', () => {
    return gulp.src('./package.json')
        .pipe(bump({
            type: 'major'
        }))
        .pipe(gulp.dest('./'));
});
// 更新版本号
gulp.task('git-push', (done) => {
    execSync('git add -A :/');
    execSync('git commit -m "update version"');
    execSync('git push');
    done();
});
