import path from 'path';
import webpack from 'webpack';
import proxyConfig from '@easytool/proxy-config';
import defineConfig from '@easytool/define-config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WebpackBundleAnalyzer from 'webpack-bundle-analyzer';
import { getFilename } from './rollup.config';
import { name, parcel, devEnvironments } from './package.json';

const NODE_ENV = process.env.NODE_ENV;      // development, link
const BUILD_PATH = NODE_ENV === 'development' ? 'build' : 'dist';
const { library, externals } = parcel;
const { servers, proxies, globals } = devEnvironments;

export default {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        writeToDisk: NODE_ENV === 'link',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        },
        host: '0.0.0.0',
        port: servers.local,
        inline: true,
        compress: true,             // 开起 gzip 压缩
        disableHostCheck: true,
        historyApiFallback: true,   // browserHistory路由
        contentBase: path.resolve(__dirname, BUILD_PATH),
        proxy: {
            ...proxyConfig(proxies)
        }
    },
    entry: {
        main: [NODE_ENV === 'development' ? './test/index.js' : './src/index.js']
    },
    output: {
        filename: getFilename('umd'),
        path: path.resolve(__dirname, BUILD_PATH),
        library,
        libraryTarget: 'umd',
        jsonpFunction: name            // 避免多个应用之间 jsonpFunction 名冲突
    },
    externals: NODE_ENV === 'development' ? undefined : externals,
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
            /**
             * eslint代码规范校验
             */
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            include: path.resolve(__dirname, 'src'),
            use: [{
                loader: 'eslint-loader',
                options: {
                    fix: true,
                    configFile: '.eslintrc.js'
                }
            }]
        }, {
            /**
             * JS加载器
             */
            test: /\.(js|jsx)?$/,
            exclude: path.resolve(__dirname, 'node_modules'),
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }]
        }, {
            /**
             * 图片加载器
             */
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 99999 * 1024
                    // name: 'images/[name].[ext]'
                }
            }]
        }]
    },
    plugins: [
        // 清除编译目录
        new CleanWebpackPlugin(),
        // 文件大小写检测
        new CaseSensitivePathsPlugin(),
        // 主页面入口index.html
        NODE_ENV === 'development' && new HtmlWebpackPlugin({                             
            filename: 'index.html',
            template: './test/index.ejs'
        }),
        // 配置全局变量
        NODE_ENV === 'development' && new webpack.DefinePlugin({
            ...defineConfig(globals)
        })
        // check package size
        // new WebpackBundleAnalyzer.BundleAnalyzerPlugin()
    ].filter(Boolean)
};
