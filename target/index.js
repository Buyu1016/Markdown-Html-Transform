const $ = require('jquery')

const oH1s = $('h1');
const sidebar = $('.sidebar-content')
let createAs = ''
let index = 1
for (let i = 0; i < oH1s.length; i++) {
    createAs += `<div><a href='#item${index++}'>${oH1s[i].outerText}</a></div>`   
}
// console.log(sidebar)
// console.log(sidebar.eq(0))
sidebar.eq(0).append(createAs)

// 控制侧边栏显示与隐藏
const oLock = $('.loading-lock')
const oSideBar = $('.sidebar')
const oContent = $('.content')

let lock = false // 默认侧边栏不显示
oLock.on('click', () => {
    if (!lock) { // 缩小
        oSideBar.css('left', '0')
        oContent.css('margin-left', '300px')
        oLock.text('展开 >>>')
        lock = true
    } else {
        oSideBar.css('left', '-300px')
        oContent.css('margin-left', '0')
        oLock.text('<<< 隐藏')
        lock = false
    }
})