const config ={
    page:{
        index:'./src/main.js'
    },
    defaultTitle:"this is all title",//页面的默认title
    cssLoader : 'sass',//记得预先安装对应loader
    toExtractCss : true,

    assetsPublicPath: '/',//资源前缀、可以写cdn地址
    assetsSubDirectory: 'static',//创建的的静态资源目录地址

    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,//调试开启时是否自动打开浏览器
    
    uglifyJs : true,//是否丑化js
    sourceMap : true,//是否开启资源映射
    plugins:[]//额外插件
}

module.exports = config;


/**
 * some auto-create-function
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ExtractRootCss = new ExtractTextPlugin({filename:'styles/[name].root.[chunkhash].css',allChunks:false});
const ExtractVueCss = new ExtractTextPlugin({filename:'styles/[name].[chunkhash].css',allChunks:true});

const isProduction = process.env.NODE_ENV === 'production'

//自动生成HTML模板
const createHTMLTamplate = function(obj){
    let htmlList = [];
    let pageList = obj;
    for(let key in pageList){
        htmlList.push(
            new HtmlWebpackPlugin({
                filename: key + '.html',
                title:Array.isArray(pageList[key])&&pageList[key][1]
                    ?pageList[key][1].toString()
                    :config.defaultTitle,
                template:path.resolve(__dirname,'../index.html'),
                chunks:[key,'vender','manifest','common'],
                chunksSortMode: 'dependency'
            })
        )
    }
    return htmlList
}
//设置多入口
const setEntry = function(obj){
    let entry = {};
    let pageList = obj;
    for(let key in pageList){
        if(Array.isArray(pageList[key]) && pageList[key][0]){
            entry[key] = path.resolve(__dirname,'../'+pageList[key][0].toString());
        }else{
            entry[key] = path.resolve(__dirname,'../'+pageList[key].toString());
        }
    }
    return entry
}
//设置样式预处理器
const cssRules = {
    less: {name:'less'},
    sass: {name:'sass', options:{indentedSyntax: true}},
    scss: {name:'sass'},
    stylus: {name:'stylus'},
    styl: {name:'stylus'}
}
const cssLoaders = function(options){
    options = options || {}

    const loaderList = options.loaders
    const ExtractCss = options.isRootCss ? ExtractRootCss : ExtractVueCss;
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    const sasscssLoader = {
        loader: 'sass-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }
    const frontLoader = [cssLoader]
    let loaders = {};
     //出了less等预加载的loader之外，还一定要有一般css的编译
    if(loaderList.indexOf('css') === -1)loaderList.unshift("css")
    loaderList.forEach(element => {
        const loaderOptions = cssRules[element]&&cssRules[element].options;
        const loaderName = cssRules[element]&&cssRules[element].name;
        let arr = element==="css" ? [] : [{
            loader: loaderName+"-loader",
            options: Object.assign({}, loaderOptions, {
                sourceMap: options.sourceMap
            })
        }]
         //遍历数组生成loader队列
        if(options.Extract){
            loaders[element] = ExtractCss.extract({
                use: frontLoader.concat(arr),
                fallback: 'vue-style-loader' 
            })
        }else{
            loaders[element] = ['vue-style-loader'].concat(frontLoader,arr)
        }
    });
     //是否提取到css文件
    if(options.Extract){
        module.exports.plugins = (module.exports.plugins || []).concat([ExtractRootCss,ExtractVueCss]);
    }

    return loaders
}
const styleLoaders = function(options){
    options.isRootCss = true;
    let output = [];
    const loaders = cssLoaders(options);

    for (const extension in loaders) {
        let loader = loaders[extension]
        output.push({
          test: new RegExp('\\.' + extension + '$'),
          use: loader
        })
    }
    return output
}
module.exports.plugins = (module.exports.plugins || []).concat(
    createHTMLTamplate(config.page)
);
module.exports.entry = setEntry(config.page);
module.exports.styleLoaders = styleLoaders({
    loaders: config.cssLoader.split('!'),
    sourceMap : config.sourceMap,
    Extract : isProduction&&config.toExtractCss,
});
module.exports.cssLoaders = cssLoaders({
    loaders: config.cssLoader.split('!'),
    sourceMap : config.sourceMap,

    Extract : isProduction&&config.toExtractCss,
});