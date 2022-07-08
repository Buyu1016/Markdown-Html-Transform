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

**运行配置好的api.js文件**

> npm start

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

**更新内容:**

- 初始版本

> v1.1.0

> 时间: 2021-08-10

**更新内容:**

- 新增侧边栏可收缩功能, 调整webpack设置, 改变一些文件资源的位置

> v2.0.0

> 时间: 2021-08-11

**更新内容:**

- 重构包框架, 采用node进行开发

> v2.0.1

> 时间: 2021-08-11

**更新内容:**

- 修复图片资源经过复制后无法打开的问题, 改动img标签样式
- 修复侧边栏无法跳转锚点功能
- 新增侧边栏标签能实时确定当前处于哪个标签范围内, 新增Top回到顶部按钮
- 修复侧边栏显示不正确问题
- 新增table中内容居中效果和靠右效果
- 修改侧边栏显示代码思路
- 修改侧边栏内容区样式
- 撤销内容区域横向滚动条,内容区域居中样式修复

> v2.1.0

> 2022-03-27

**更新内容:** 

- 更改 Code和Pre代码块样式, 新增字体family, 更新scroll样式, 修复侧边栏无滚动条问题
- 彻底更改文件生成, 将所有文件浓缩为一个HTML文件
- 图片统一使用base64格式存储与HTML文件内部
- 采用原生Js操作DOM方式, 舍弃Jquery操作DOM的方式

> v2.1.1
> 2022-07-08

**更新内容:**

- 调整滚动条样式
- 调整滚动条为平滑滚动
- 修复侧边栏没有滚动条问题