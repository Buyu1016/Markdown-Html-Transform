const { resolve } = require('path')
const MarkdownHtmlTransform = require('./plugin/markdown-html-transform/index')
// 复制资源的Plugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 清除dist目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: resolve(__dirname, 'main.js'),
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    plugins: [
        new MarkdownHtmlTransform({
            // markdown路径
            path: resolve(__dirname, 'target/index.md'),
            // markdown转html后的html文件名
            filename: 'index',
        }),
        // 复制资源
        new CopyWebpackPlugin([{
                from: 'plugin/markdown-html-transform/css', to: 'css'
            }, {
                from: 'target/images', to: 'images'
            }
        ]),
        // 
        new CleanWebpackPlugin()
    ]
}