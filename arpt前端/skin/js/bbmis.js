/**
 * Created by Wonderchief on 2017/1/12.
 */
// var service = "http://test.legle.cc/";
var service = "http://arpt.leglear.com:82/";
var service01 = "http://arpt.leglear.com/";

var APPID = "arpt-boss";
function test1() {
    login('test','test');
}
function login(username,password) {
    data={
        username:username
        ,password:password
    };
    req('login',data,function (result) {
        console.log(result);
    });
}
//对jq中的ajax请求的封装，处理一些常用库
function req(url, data, fn) {
    var reqpack = {
        appid: APPID
        , core: {}
        , data: null
        , token: null
    };
    //进行装包操作,把本地的信息塞到core里,比如XXXid这些或者token
    if (localStorage.userid != null) {
        reqpack.core.userid = localStorage.userid;
    }
    if (localStorage.customerid != null) {
        reqpack.core.customerid = localStorage.customerid;
    }
    if (localStorage.token != null) {
        reqpack.token = localStorage.token;
    }
    reqpack.data = data;
    //消息处理程序
    var msgHandler=function (msg) {
        switch (msg.type)
        {
            case 0://空消息
                break;
            case 1://系统默认消息
                console.log(msg.data);
                break;
            case 2://系统异常消息
                console.error(msg.data);
                break;
            case 3://控制客户端重定向
                location.href=msg.data;
                break;
            case 4://控制客户端弹出消息框

                alert(msg.data);

                break;
            case 5://控制localstorage
                $.each(msg.data,function (i,obj) {
                    localStorage.setItem(i,obj);
                });
                break;
            case 9://控制客户端eval执行js脚本
                eval(msg.data);
                break;
        }
    };
    //
    $.post(url, reqpack, function (pack) {
        console.log(pack);

        //进行解包操作,处理status
        switch(pack.status){
            case 0://正常状态
                //执行msg处理器
                if(pack.msg instanceof Array)
                {
                    for(var i in pack.msg)
                    {
                        msgHandler(pack.msg[i]);
                    }
                }
                else
                    msgHandler(pack.msg);
                break;
            case -1://服务器异常状态
                break;
            case 1://服务器繁忙状态
                break;
            case 2://没有权限访问
                break;
            case 3://找不到对应的业务
                break;
        }


        fn(pack.result);
    }, 'JSON');

}

//获取QueryString的数组

function getQueryString(){

    var result = location.search.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g"));

    if(result == null){

        return "";

    }

    for(var i = 0; i < result.length; i++){

        result[i] = result[i].substring(1);

    }

    return result;

}

//根据QueryString参数名称获取值

function getQueryStringByName(name){

    var result = location.search.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));

    if(result == null || result.length < 1){

        return "";

    }

    return result[1];

}

//根据QueryString参数索引获取值

function getQueryStringByIndex(index){

    if(index == null){

        return "";

    }

    var queryStringList = getQueryString();

    if (index >= queryStringList.length){

        return "";

    }

    var result = queryStringList[index];

    var startIndex = result.indexOf("=") + 1;

    result = result.substring(startIndex);

    return result;

}
