var express = require('express')
var app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('<h1>hello world</h1>')
})

//此系统静态文件
app.use(express.static('public'));
//file 接口，真实文件的url前缀
//search 查询
//list 列出当前文件目录下的所有文件
//download
//upload

//启动
var server = app.listen(8889, function () {
   var host = server.address().address
  var port = server.address().port
   console.log("文件浏览器，访问地址为 http://%s:%s", host, port)
 })