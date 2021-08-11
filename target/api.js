const { resolve } = require('path')
// 调用markdown-html-transform向外导出的函数
const { markdownHtmlTransform } = require('../src/markdown-html-tansform/index')

markdownHtmlTransform(resolve(__dirname, 'index.md'), 'index', resolve(__dirname, 'image'))