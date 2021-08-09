const { resolve } = require('path')
const MarkdownHtmlTransform = require('./plugin/markdown-html-transform/index')

module.exports = {
    mode: 'development',
    entry: resolve(__dirname, 'target/index.js'),
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'index.js'
    },
    plugins: [
        new MarkdownHtmlTransform({
            path: resolve(__dirname, 'target/index.md'),
            filename: 'index.html'
        })
    ]
}