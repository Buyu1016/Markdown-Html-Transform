# Markdown-Html-Transform

**v2.0.0**

> Markdown转换html生成配套文件

**CLI**
> npm install

**使用示例**

```
// 调用markdown-html-transform向外导出的函数
const { markdownHtmlTransform } = require('../src/markdown-html-tansform/index')

// markdownHtmlTransform(模版绝对路径, 输出文件名, 图片文件夹 | 图片 )
markdownHtmlTransform(resolve(__dirname, 'index.md'), 'index', resolve(__dirname, 'image'))
```

**所需环境**
> node

> npm

**依赖库**
> node的fs模块

> node的path模块

> [marked](https://www.npmjs.com/package/marked)

> [webpack](https://webpack.docschina.org/) **v2.0.0已弃用**

> [webpack-cli](https://www.npmjs.com/package/webpack-cli) **v2.0.0已弃用**

## 版本迭代记录

> v1.0.0

> 时间: 2021-08-09

**更新内容:** 初始版本

> v1.1.0

> 时间: 2021-08-10

**更新内容:** 新增侧边栏可收缩功能

> v1.2.0

> 时间: 2021-08-10

**更新内容:** 调整webpack设置, 改变一些文件资源的位置

> v2.0.0

> 时间: 2021-08-11

**更新内容:** 重构包框架, 采用node进行开发

> v2.1.0

> 时间: 2021-08-11

**更新内容:** 修复图片资源经过复制后无法打开的问题, 改动img标签样式

> v2.2.0

> 时间: 2021-08-11

**更新内容:** 修复侧边栏无法跳转锚点功能

> v2.3.0

> 时间: 2021-08-12

**更新内容:** 新增侧边栏标签能实时确定当前处于哪个标签范围内, 新增Top回到顶部按钮

> v2.3.1

> 2021-08-22

**更新内容:** 修复侧边栏显示不正确问题

> v2.3.2

> 2021-08-23

**更新内容:** 新增table中内容居中效果和靠右效果