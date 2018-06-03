const path = require('path');
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin');//webpack 


const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')
const config= require('./bin/config')
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)




baseWebpackConfig = {
    entry:config.entry, 
    output:{
        path:path.resolve(__dirname,'./dist/'+ process.env.npm_package_version),
        filename:"js/[name].js"
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude:/node_modules/
            },
            {
                test:/\.(png|jpe?j|gif|svg)(\?.*)?$/,
                loader:'url-loader',
                options:{
                    limit:10000,
                    name:'img/[name].[ext]?[hash]'
                }
                //图片文件大小小于limit的数值，就会被改写成base64直接填入url里面，
                //不然会输出到dist/img目录下，[name]原文件名，[ext]原后缀，[hash]在url上加上一点哈希值避免缓存。
            },
            {
                test:/\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader:'url-loader',
                options:{
                    limit:10000,
                    name:'fonts/[name].[ext]?[hash]'
                }
                //和上面一致
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options:{
                    loaders: config.cssLoaders 
                }
            }
        ].concat(config.styleLoaders)
    },
    plugins:[
        new VueLoaderPlugin(),
        new CopyWebpackPlugin([
            {
              from: path.resolve(__dirname, './static'),
              to: config.assetsSubDirectory,
            }
        ])
    ].concat(config.plugins),
    resolve:{
        extensions: ['.js', '.vue', '.json'],
        alias:{
            'vue$':'vue/dist/vue.esm.js',// 'vue/dist/vue.common.js' for webpack 1
            '@': path.resolve(__dirname,'./src'),
        }
    },
}

//生产环境
if (process.env.NODE_ENV === 'development') {
    console.log(process.env.NODE_ENV);
    baseWebpackConfig = merge(baseWebpackConfig,{
        devtool : '#eval-source-map',
        devServer : {
            clientLogLevel: 'warning',
            historyApiFallback: true,
            hot: true,
            compress: true,
            host: HOST || config.host,
            port: PORT || config.port,
            open: config.autoOpenBrowser,
            publicPath:config.assetsPublicPath || '/'
        },
        plugins : [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"development"'
                }
            }),
            new webpack.HotModuleReplacementPlugin()
        ]
    })
}
module.exports = baseWebpackConfig;

