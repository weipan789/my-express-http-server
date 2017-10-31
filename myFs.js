var fs=require('fs');
var util = require('util');
var path = require("path")
var showDirContent=function (p) {
    return fs.readdirSync(p).map(function (fileName) {
        var fName = path.join(p, fileName);
        return {
            fileName:fileName,
            isDirectory:fs.statSync(fName).isDirectory()
        }
    });
}

exports.list=showDirContent;