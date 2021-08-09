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