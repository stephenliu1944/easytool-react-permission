import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';
import url from '@rollup/plugin-url';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import merge from 'lodash/mergeWith';
import { main, module, browser, parcel } from './package.json';

const BUILD_PATH = 'dist';
const { library, exports, externals, globals } = parcel;

function rollupMerge(base, source) {
    let config = merge({}, base, source, (obj, src, key) => {
        // 合并数组
        if (Array.isArray(obj) || Array.isArray(src)) {
            return [].concat(obj, src).filter(Boolean);
        }
    });
    
    return config;
}

export function getFilename(format) {
    let filename;

    switch (format) {
        case 'cjs':
            filename = main.split('/').pop();
            break;
        case 'es':
            filename = module.split('/').pop();
            break;
        case 'umd':
            filename = browser.split('/').pop();
            break;
    }

    return filename;
}

function base(format) {
    let filename = getFilename(format);

    return {
        input: 'src/index.js',
        output: {
            file: `${BUILD_PATH}/${filename}`
        },
        external: externals,
        plugins: [
            del({
                targets: `${BUILD_PATH}/${filename}`
            }),
            eslint({
                fix: true,
                throwOnError: true,
                throwOnWarning: true,
                include: ['src/**/*.js'], 
                configFile: '.eslintrc.prod.js'
            }),
            babel({
                exclude: 'node_modules/**',
                babelHelpers: 'runtime'
            }),
            // nodeResolve(),
            commonjs(),
            json(),
            // 导入的文件, 仅使用base64
            url({
                limit: 99999 * 1024
            })
        ]
    };
}

const parcels = [{
    // umd module
    output: {
        format: 'umd',
        sourcemap: true,
        name: library,
        exports,
        globals
    },
    plugins: [
        terser()	                     
    ]
}, {
    // commonjs module
    output: {
        format: 'cjs',
        exports
    },
    external: [/@babel\/runtime/]
}, {
    // es module
    output: {
        format: 'es'
    },
    external: [/@babel\/runtime/]
}];

export default parcels.map(parcel => rollupMerge(base(parcel.output.format), parcel));