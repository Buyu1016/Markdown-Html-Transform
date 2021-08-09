// markdown转html
const { readFileSync } = require('fs')
const { resolve } = require('path')
const marked = require('marked')

class MarkdownHtmlTransform{
    constructor({ path, filename = 'index.html' }) {
        // 判断是否传入path
        if (!path) {
            throw new Error('Please pass in the markdown file path you want to convert')
        }
        this.path = path;
        this.filename = filename;
    }
    apply(compiler) {
        compiler.hooks.emit.tap('markdown-html-transform', (compilation) => {
            const fileResources = compilation.assets
            // 读取模版的内容
            const temeplateHtml = readFileSync(resolve(__dirname, '../../', 'target' ,'temeplate.html'), 'utf8')
            // 读取target目标markdown的内容
            const targetMarkdown = readFileSync(this.path, 'utf8')
            const renderer = {
                index: 1,
                heading(text, level) {
                  return `<h${level} id='item${renderer.index++}'>${text}</h${level}>\n`;
                }
            };
            marked.use({ renderer })
            const markdownHtml = marked(targetMarkdown)
            console.log(markdownHtml)
            // return
            // 查询到模版中<!-- content -->这个注释的位置，将markdown转换后的html放入这里
            const result = temeplateHtml.replace('<!-- content -->', markdownHtml)
            // 放入temeplateHtml中并形成一个文件
            fileResources[this.filename] = {
                source() {
                    return result
                },
                size() {
                    return result.length
                }
            }
        })
    }
}

module.exports = MarkdownHtmlTransform;