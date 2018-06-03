process.env.NODE_ENV = 'production'
const path = require('path')
const config = require('./config')
const webpack = require('webpack')
const merge = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const baseWebpackConfig = require("../webpack.config.js")

const webpackConfig = merge(baseWebpackConfig,{
    devtool :'#source-map',//用于开发环境的源码映射，eval-source-map是开发环境用的源码映射，source-map是生成环境用的源码映射
    output:{
        path:path.resolve(__dirname,'../dist/'+ process.env.npm_package_version),
        filename:"js/[name].[chunkhash].js",
        chunkFilename:"js/[id].[chunkhash].js",
        publicPath:config.assetsPublicPath || '/'
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({//webpack1.0迁移插件
            minimize: true
        }),
    ],
    optimization:{
        minimizer: [
            //用于js压缩
            new UglifyJsPlugin({
                uglifyOptions: {
                    compress: {
                      warnings: false
                    }
                  },
                sourceMap:config.sourceMap
            }),
        ],
        runtimeChunk: {
            name: 'manifest'
        },
         //抽取从node_modules引入的模块，如vue
        splitChunks:{
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
              vendor: {
                name: 'vendor',
                chunks: 'initial',
                priority: -10,
                reuseExistingChunk: false,
                test: /node_modules\/(.*)\.js/
              },
              styles: {
                name: 'styles',
                test: /\.(scss|css)$/,
                chunks: 'all',
                minChunks: 1,
                reuseExistingChunk: true,
                enforce: true
              }
            }
        }
    }
})
if(config.sourceMap){
    module.exports.devtool = false
}

module.exports = webpackConfig
