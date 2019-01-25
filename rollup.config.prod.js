import { uglify } from 'rollup-plugin-uglify';
import base, { rollupMerge } from './rollup.config.base';
import pkg from './package.json';

const BUILD_PATH = process.env.BUILD_PATH || 'build';
var { main, module, browser, libraryName } = pkg;
var cjsName = main.split('/')[1];
var esmName = module.split('/')[1];
var umdName = browser.split('/')[1];

export default [rollupMerge(base(umdName), {
    output: {
        file: `${BUILD_PATH}/${umdName}`,
        format: 'umd',
        name: libraryName
    },
    plugins: [
        uglify()	                     
    ]
}), rollupMerge(base(cjsName), {
    output: {
        file: `${BUILD_PATH}/${cjsName}`,
        format: 'cjs'
    }
}), rollupMerge(base(esmName), {
    output: {
        file: `${BUILD_PATH}/${esmName}`,
        format: 'es'
    }
})];