#! /usr/bin/env node
// 引入模块
var fs = require("fs"),
    options = process.argv,
    $ = require("./jquery"),
    jsdom = require('jsdom'),
    program = require('./commander/index'),
    html_beautify = require('./html_beautify').style_html,
    input = ""
// 变量
    fileNumCount = 0,
    fileDoneCount = 0

// 设置选项
program
    .version('0.0.1')
    .option('-v, --version ', 'output the version number')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv)

// 处理选项
if (program.readHelp) {
    console.log("  - here are options:")
}

// 处理输入的路径或文件
input = process.argv[2]
if (typeof input === "undefined") {
    console.log("  - you need to input your path, like 'nf ./', or file like './avalon.carousel.ex1.html'")
} else{
    if(fs.statSync(input).isDirectory()) { // 参数为路径
        var fileList = []

        getFileList(process.argv[2], fileList)
        handleFileList(fileList)
    } else { // 参数为文件
        fileNumCount = 1
        handleFile(input)
    }
}

// 递归目录寻找文件
function getFileList(path, fileList){
    var dirList = fs.readdirSync(path)

    dirList.forEach(function (item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
            getFileList(path + '/' + item, fileList);
        } else {
            var regex = /avalon.\w+.ex\d*.html/

            // 匹配ex*.html
            if (regex.test(item)) {
                fileList.push({"file": path + '/' + item, "path": path})
            }
        }
    })
}

// 处理文件列表
function handleFileList(files){
    fileNumCount = files.length

    // 检索文件
    for(var i = 0, len = files.length; i < len; i += 1){
        var file = files[i].file

        // 文件处理
        handleFile(file)
    }
}

// 处理文件项
function handleFile(file){
    // 显示正在处理的文件
    console.log("handling... \t" + file)

    // 读入
    jsdom.env(file, function(e, window){
        if (e) {
            throw e
        }

        var pre = $(window).find("pre")[0],
            preStartLocation = 0,
            preEndLocation = 0,
            codeContent = "",
            htmlContent = ""

        // pre清空
        pre.innerHTML = ""

        // 取pre还存在时的html
        codeContent = $(window).find("html")[0].innerHTML

        // 删除pre标签
        preStartLocation = codeContent.indexOf("<pre"),
        preEndLocation = codeContent.indexOf("</pre>")
        codeContent = codeContent.slice(0, preStartLocation)
                    + codeContent.slice(preEndLocation + 6, codeContent.length)

        // code格式化,替换"<"和">"
        codeContent = html_beautify(codeContent)
        codeContent = codeContent.replace(/</g, "&lt;")
        codeContent = codeContent.replace(/>/g, "&gt;")

        // 把注释填入pre
        pre.innerHTML = "\n" + codeContent + "\n"

        // 格式化Html
        htmlContent = "<!DOCTYPE html>\n"
                    + "<html>\n"
                    + $(window).find("html")[0].innerHTML
                    + "\n</html>"
        htmlContent = html_beautify(htmlContent, {
            unformatted: ['pre']
        })

        // 写入
        fs.writeFile(file, htmlContent, function(e){
            if(e) {
                throw e
            }

            // 检查是否全部处理完
            fileDoneCount += 1
            if(fileDoneCount === fileNumCount){
                console.log("done.")
            }
        })
    })
}
