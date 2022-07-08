const fs = require('fs')
const { resolve } = require('path')
const marked = require('marked')
const mimeTypes = require('mime-types');

/**
 * Markdown-Html-Transform主要转换函数
 * @param { String } path 文件路径
 * @param { String } filename 输出文件名
 * @param { Boolean } imageFile image文件夹路径
 */
function markdownHtmlTransform(path, filename = 'index', imageFile) {
    // path为必须
    if (!path) {
        throw new Error('Please fill in the file path in the configuration');
    }
    if (!fs.existsSync(path)) {
        throw new Error('Please enter the correct markdown file path');
    }
    // 第一步应该读取各种需要的文件
    // 读取目标markdown文件内容
    const markdownContent = readFileContent(path);
    // 读取模版html文件内容
    const temeplateContent = readFileContent(resolve(__dirname, 'temeplate.html'));
    // 利用marked库将markdown转换为html
    // 中间件1: 对h级别标签进行添加唯一值id
    const hRender = {
        heading(text, level) {
            return `<h${level} id="${textToBase64(text)}">${text}</h${level}>`
        }
    };
    marked.use({ renderer: hRender });
    // 中间件2: 将图片转换为base64格式放入img中的src属性中
    const imgRender = {
        image(href, title, text) {
            return `<img src="${imageToBase64(imageFile, href)}" alt="${text}"/>`;
        }
    };
    marked.use({ renderer: imgRender });
    const htmlString = marked(markdownContent);
    // 将html插入到模版html中
    let newHtml = temeplateContent.replace('<!-- content -->', htmlString);
    // 将css资源插入html中
    const cssContent = readFileContent(resolve(__dirname, 'css', 'markdown.css'));
    newHtml = newHtml.replace('/*style*/', cssContent);
    // 创建并写入
    console.log('>>>*正在创建并写入内容*<<<');
    fs.rmdirSync(resolve(__dirname, '..', '..', 'dist'), {
        recursive: true
    })
    console.log('>>>***正在创建文件中***<<<')
    fs.mkdirSync(resolve(__dirname, '..', '..', 'dist'));
    // 压缩代码
    console.log('>>>***正在压缩文件中***<<<');
    newHtml = newHtml.replace(/\r\t/g, '');
    writeFileContent(resolve(__dirname, '..', '..', 'dist', `${filename}.html`), newHtml);
    console.log('>>>**Markdown转换完成**<<<');
}

/**
 * 读取文件内容
 * @param { String } path 文件路径 
 * @returns { String } 文件内容
 */
function readFileContent(path) {
    return fs.readFileSync(path, 'utf-8');
}

/**
 * 创建并写入文件
 * @param {String} path 输出文件路径 
 * @param {*} content 写入文件的内容
 */
function writeFileContent(path, content) {
    fs.writeFileSync(path, content);
}

/**
 * 用于将一小段标题文本转化为base64格式
 * @param {*} text 
 */
function textToBase64(text) {
    return Buffer.from(text).toString('base64');
}

/**
 * 用于将图片转化为base64格式
 * @param {*} baseImageFilePath 图片基础路径
 * @param {*} href 图片路径
 * @returns base64字符串
 */
function imageToBase64(baseImageFilePath, href) {
    const newPath = resolve(baseImageFilePath, '..', href);
    // 此处获取的base64并不是一个完整的base64编码, 缺少了图片类型
    const base64Img = fs.readFileSync(newPath).toString('base64');
    const imgType = mimeTypes.lookup(newPath);
    return `data:${imgType};base64,${base64Img}`;
}


module.exports = { markdownHtmlTransform }