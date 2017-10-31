String.prototype.trim = function () {
    var t = this.replace(/(^\s*)|(\s*$)/g, "");
    return t.replace(/(^\u3000*)|(\u3000*$)/g, "");
};
function killErrors() {
    return true;
}

//重写alert
window.alert = function(msg){
    $.messager.alert('信息', msg);
}

//ajax全局设置
$.ajaxSetup({
    complete: function (XMLHttpRequest, status) {
        var statusCode = XMLHttpRequest.status;
        if (statusCode >= 400) {//状态码大于400
            cj._tipMessageError('网络异常，状态码:' + statusCode);
        } else {
            var res = XMLHttpRequest.responseText;
            var data = JSON.parse(res);
            //业务状态码，存在code属性，并且不为0时，被评为异常
            if (data && data.code && !(Number(data.code) == 0 || Number(data.code) == 200)) {
                cj._alterMessageError(data.message || ( '请求异常,异常代码:' + data.code));
            }
        }
    }
});

//date extended
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    var week = {
        "0": "日",
        "1": "一",
        "2": "二",
        "3": "三",
        "4": "四",
        "5": "五",
        "6": "六"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

var cj;//常用 common js的意思
/*
if (parent.cj) {
    cj = parent.cj;//如果父级页面已经存在cj,则使用父级页面的cj
}
*/

Enums={
    gender:[{text:'女',value:0},{text:'男',value:1}],
    caijistatus:[{
            text: '采集',
            value: '1',
            selected:true
        },{
            text: '不采集',
            value: '0'
        }],
    caijigerenxinxi:[
        {
            text: '采集个人信息',
            value: '1',
            selected:true
        },{
            text: '不采集个人信息',
            value: '0'
        }
    ],
    fixstatus:[{text:'全部',value:'%'},{text:'已处理',value:'1'},{text:'未处理',value:'0'}],
    timemode:[{text:'普通模式',value:'0'},{text:'Quartz模式',value:'1'}],
    qiyonggerenxinxi:[{text:'启用',value:'1'},{text:'不启用',value:'0'}]
}
$(function () {
    var _myNum = 0;
    if (cj) {
        return;
    }
    cj = {};
    //把long型的日期格式转成yyyy-MM-dd格式
    function getDate(date) {
        //得到日期对象
        var d = new Date(date);
        //得到年月日
        var year = d.getFullYear();
        var month = (d.getMonth() + 1);
        var day = d.getDate();
        var rtn = year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);

        return rtn;
    }

    var getBeanId = function () {
        _myNum++;
        return 'cjid' + _myNum;
    }

    var getEnumlower = function (searchtype) {
        return Enums[searchtype];
    }
    var enfmt = function (ef) {
        return function (value, recode, index) {
            if (ef) {
                for (var i = 0; i < ef.length; i++) {
                    if (ef[i].value == value) {
                        return ef[i].text;
                    }
                }
                return value;
            }
        }
    }
    cj['getDate'] = getDate;
    cj['test'] = function () {
        $.messager.alert('测试', _myNum++);
    }
    //列表转换时用如 formatter:cj.enumFormatter('active')
    cj.enumFormatter = function (ename, f) {
        return enfmt(getEnumlower(ename.toLowerCase()))
    }
    //下拉菜单时用如 data:cj.getEnum('gender')
    cj.getEnum = function (ename) {
        return getEnumlower(ename.toLowerCase())
    }
    cj.successAction=function (resp, callbackFn) {
        if(resp && 0== Number(resp.code)) {
            callbackFn();
        }
    }
    $.toast.config.align = 'right';
    $.toast.config.width = 400;
    var alterErrorOptions = {
        duration: 4000,
        sticky: true,
        type: 'danger'
    };
    var tipErrorOptions = {
        duration: 4000,
        sticky: false,
        type: 'danger'
    };
    var successOptions = {
        duration: 3000,
        sticky: false,//自动消失
        type: 'success'
    };
    //三种提示方式，_tipMessageSuccess(提示成功的并消失),_tipMessageError(提示错误的并消失),_alterMessageError(提示错误的但不消失)
    //内部使用
    $.extend(cj, {
        _tipMessageSuccess: function (content) {
            $.toast(content,successOptions);
        }, _tipMessageError: function (content) {
            $.toast(content,tipErrorOptions);
        }, _alterMessageError: function (content) {
            $.toast(content,alterErrorOptions);//todo不会自动消失
        }
    });
    //外部使用
    cj.tipMessageSuccess=cj._tipMessageSuccess;
    cj.tipMessageError=cj._tipMessageError;

    cj.showSuccessMessage=function (resp0,msg,callbackFn) {
        var resp=resp0;
        if('string'== (typeof  resp)) {
            resp = JSON.parse(resp);
        }
        var content=msg;
        var callback=callbackFn;
        if("function"==(typeof msg)){
            callback=msg;
            content=undefined;
        }
        if(resp && 0== Number(resp.code)){
            cj._tipMessageSuccess(content);
            if(callback) {
                callback();
            }
            return true;//网络请求成功返回true,使用时可以根据这个结果，再进行错误的提示版本，一般不需要，非除屏蔽了ajax全局设置
        }
    }

    //强大的按钮工具
    function parseMyButtons(btns,id) {
        if(btns==undefined) {
            return undefined;//没有按钮，连工具栏都不需要了
        }
        if($.isArray(btns)) {
            if(btns.length==0) {
                //如果是0个元素,就返回 保存和关闭两个按钮
                //todo
            }else{
                //几个按钮就是几个按钮
                //先文字按钮做起，后面再重构
                var s="<div style='text-align: center' id="+id+">"
                for(var i in btns) {
                    var b = btns[i];
                    s+='<a style="cursor: pointer" class="easyui-linkbutton">'+b+'</a>';
                }
                s+='</div>';
                return s;
            }
        }else{
            console.log('一定要是数组')
        }
    }
    cj['openWindow'] = function (cjwOption) {
        var cjwinid = getBeanId();
        var winHtml = '<div id=' + cjwinid + '></div>';
        $('body').append(winHtml);
        var btnid = cjwinid+'_btn';
        var $window = $('#' + cjwinid).append(cjwOption.html).window({
            //inline:true,
            border:'thin',
            cls:'c6',
            modal:cjwOption.modal,
            minimizable:cjwOption.minimizable,
            title: cjwOption.title || '信息',
            width: cjwOption.width || 500,
            height: cjwOption.height || 380,
            //footer: cjwOption.footer || $('<div style="padding:5px;">Footer Content.</div>'),
            footer:parseMyButtons(cjwOption.btns,btnid),
            onOpen: function () {
                $.parser.parse('#'+btnid);
                var me = $(this);
                ME=me;
                me.bind('close',function () {
                    $window.window('close');
                })
                $.parser.parse(me);
                if(cjwOption.onOpen) {
                    cjwOption.onOpen.apply(me,me.window('footer'));
                }
            },
            onClose: function () {
                $window.window('destroy');
            }
        });
        return $window;
    };

    var jsonDataCache={};
    //requireJSON,添加缓存功能，如果已经加载，就不需要再必请求了
    var requireJSON=function (url,callback) {
        var urlKey = encodeURIComponent(url);
        var data = jsonDataCache[urlKey];
        if(data){
            callback(data);
        }else{
            $.getJSON(url,function (resp) {
                //todo 存在并发问题
                data=jsonDataCache[urlKey]=resp;
                callback(data);
            })
        }
    }
    cj['requireJSON']=requireJSON;
    cj['formToJSON']=function (form) {
        var $form = $(form);
        var myJson={};
        $form.find('input[name]').each(function (index,item) {
            var $item=$(item);
            myJson[$item.attr('name')] = $item.val();
        });
        return myJson;
    }
})
