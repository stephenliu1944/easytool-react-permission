import bump from 'gulp-bump';
import { task, src, dest } from 'gulp';
import { execSync } from 'child_process';

// 更新预发布版本号, 开发中版本, 可能会有较大改动.
task('version-prerelease', () => {
    return src('./package.json')
        .pipe(bump({
            type: 'prerelease'
        }))
        .pipe(dest('./'));
});
// 更新 Z 版本号, 修复bug, 兼容老版本
task('version-patch', () => {
    return src('./package.json')
        .pipe(bump({
            type: 'patch'
        }))
        .pipe(dest('./'));
});
// 更新 Y 版本号, 兼容老版本
task('version-minor', () => {
    return src('./package.json')
        .pipe(bump({
            type: 'minor'
        }))
        .pipe(dest('./'));
});
// 更新 X 版本号, 不兼容老版本
task('version-major', () => {
    return src('./package.json')
        .pipe(bump({
            type: 'major'
        }))
        .pipe(dest('./'));
});
// 更新版本号
task('git-push', (done) => {
    execSync('git add -A :/');
    execSync('git commit -m "update version"');
    execSync('git push');
    done();
});