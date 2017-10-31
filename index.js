var express = require('express')
var os = require("os")
var myFs = require('./myFs');

var app = express()

var parsePath=function (relativePath) {
    var path= __dirname+'/'+relativePath;
    if(os.type()!='Linux') {
        path = path.replace(/\//g, '\\').replace(/\\/g,'\\\\');
    }
    return path;
}

//主页
app.get('/', function (req, res) {
  var filePath=parsePath('public/index.html');
    res.sendFile(filePath);
})

//系统静态文件
app.use(express.static('public'));
//文件浏览页面
app.get('/file/*',function (req, res) {
    //var path=parsePath(req.params[0]);
    var filePath=parsePath('public/file.html');
    res.sendFile(filePath);
})
//search 查询
//list 列出当前文件目录下的所有文件
app.get('/list/*',function (req, res) {
    res.json(myFs.list(parsePath(req.params[0])));
})

//下载文件
app.get('/download/*',function (req, res) {
    res.download(parsePath(req.params[0]));
})
//多功能预览
app.get('/preview/*',function (req, res) {
    //todo
})
//启动
var server = app.listen(8889, function () {
   var host = server.address().address
  var port = server.address().port
   console.log("文件浏览器，访问地址为 http://%s:%s", host, port)
 })