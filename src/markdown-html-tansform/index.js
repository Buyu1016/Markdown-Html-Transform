const fs = require('fs')
const { resolve, basename } = require('path')
const marked = require('marked')

/**
 * Markdown-Html-Transform主要转换函数
 * @param { String } path 文件路径
 * @param { String } filename 输出文件名
 * @param { Boolean } imageFile image文件夹路径
 */
function markdownHtmlTransform(path, filename = 'index', imageFile) {
    // path为必须
    if (!path) {
        throw new Error('Please fill in the file path in the configuration')
    }
    if (!fs.existsSync(path)) {
        throw new Error('Please enter the correct markdown file path')
    }
    // 第一步应该读取各种需要的文件
    // 读取目标markdown文件内容
    const markdownContent = readFileContent(path)
    // 读取模版html文件内容
    const temeplateContent = readFileContent(resolve(__dirname, 'temeplate.html'))
    // 利用marked库将markdown转换为html
    const renderer = {
        index: 0,
        index_h2: 1,
        heading(text, level) {
            if (level === 1) {
                renderer.index_h2 = 1;
                return `<h${level} id='item${++renderer.index}'>${text}</h${level}>\n`;
            } else if (level === 2) {
                return `<h${level} id='item${renderer.index}-${renderer.index_h2++}'>${text}</h${level}>\n`;
            } else {
                return `<h${level}>${text}</h${level}>\n`;
            }
        }
    };
    marked.use({ renderer })
    const htmlString = marked(markdownContent)
    // 将html插入到模版html中
    const newHtml = temeplateContent.replace('<!-- content -->', htmlString)
    // 创建并写入
    console.log('>>>*正在创建并写入内容*<<<')
    fs.rmdirSync(resolve(__dirname, '..', '..', 'dist'), {
        recursive: true
    })
    console.log('>>>***正在创建文件夹***<<<')
    fs.mkdirSync(resolve(__dirname, '..', '..', 'dist'))
    fs.mkdirSync(resolve(__dirname, '..', '..', 'dist', 'css'))
    // 复制css文件资源
    const cssContent = readFileContent(resolve(__dirname, 'css', 'markdown.css'))
    writeFileContent(resolve(__dirname, '..', '..', 'dist', 'css', 'markdown.css'), cssContent)
    if (imageFile) { // 表示是有图片文件夹的
        if (fs.existsSync(imageFile)) { // 查看文件夹路径是否正确
            if (!isFile(imageFile)) { // 路径为一个文件夹
                // 在dist中创建image文件夹
                fs.mkdirSync(resolve(__dirname, '..', '..', 'dist', basename(imageFile)))
                // 深度复制资源
                copyResources(imageFile, imageFile)
            } else {// 路径为一张图片
                const img = fs.readFileSync(imageFile)
                writeFileContent(resolve(__dirname, '..', '..', 'dist', basename(imageFile)), img)
            }
        } else {
            throw new Error ('The picture folder path is incorrect')
        }
    }
    writeFileContent(resolve(__dirname, '..', '..', 'dist', `${filename}.html`), newHtml)
    console.log('>>>**Markdown转换完成**<<<')
}

/**
 * 读取文件内容
 * @param { String } path 文件路径 
 * @returns { String } 文件内容
 */
function readFileContent(path) {
    return fs.readFileSync(path, 'utf-8')
}

/**
 * 创建并写入文件
 * @param {String} path 输出文件路径 
 * @param {*} content 写入文件的内容
 */
function writeFileContent(path, content) {
    fs.writeFileSync(path, content)
}

/**
 * 递归复制资源
 * @param { Stiring } folderPath 文件夹路径 
 */
function copyResources(folderPath, imageFile) {
    fs.readdirSync(folderPath).forEach((item) => {
        // item为文件/文件夹名字
        const newPath = (resolve(folderPath, item)).replace(imageFile, resolve(__dirname, '..', '..', 'dist', basename(imageFile)))
        if (isFile(resolve(folderPath, item))) { // 如果是文件则直接读取文件
            const fileContent = fs.readFileSync(resolve(folderPath, item))
            writeFileContent(newPath, fileContent)
        } else {
            fs.mkdirSync(newPath)
            copyResources(resolve(folderPath, item), imageFile)
        }
    })
}

/**
 * 判别一个文件信息是否为文件
 * @param { String } path 文件/文件路径 
 * @returns { Boolean } 如果为文件则true
 */
function isFile(path) {
    return fs.statSync(path).isFile()
}


module.exports = { markdownHtmlTransform }