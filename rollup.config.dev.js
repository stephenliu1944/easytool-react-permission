import json from 'rollup-plugin-json';
import serve from 'rollup-plugin-serve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import base, { rollupMerge } from './rollup.config.base';
import pkg from './package.json';

const { local } = pkg.devEnvironments.servers;
const BUILD_PATH = 'build';
const FILE_NAME = 'index';

export default rollupMerge(base(), {
    output: {
        file: `${BUILD_PATH}/${FILE_NAME}.js`,
        format: 'iife',
        sourcemap: true
    },
    plugins: [
        json(),
        // web服务
        serve({
            host: '0.0.0.0',
            port: local,
            contentBase: [BUILD_PATH],
            openPage: 'index.html',
            historyApiFallback: 'index.html'
        }),
        htmlTemplate({
            template: 'test/template.html',
            target: 'index.html'
        })
    ]
});