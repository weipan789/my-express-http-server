$(function () {
    var url=location.href;
    url = url.replace('file', 'list');
    $('body').append('<li><a href="..">返回上一级</a></li>');
    $.get(url,function (resp) {
        $(resp).each(function (index,item) {
            var href;
            if(item.isDirectory) {
                item.fileName += '/';
                href=item['fileName'];
            }else{
                //下载接口
                href=location.href.replace('file','download')+item.fileName
            }

            var $li=$('<li><a href="'+href+'">'  + item.fileName + '</a></li>');
            if(item['isDirectory']==true) {
                $li.addClass('isDirectory');
            }
            $('body').append($li);
        })
    })
})