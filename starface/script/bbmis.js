/**
 * Created by Wonderchief on 2017/1/12.
 */
var APPID = "webadmin";

// var HOSTNAME = "http://test.legle.cc";
var HOSTNAME = "http://arpt.leglear.com:82";
//对jq中的ajax请求的封装，处理一些常用库
function req(url, data, fn) {
    var reqpack = {
        appid: APPID
        , core: {}
        , data: null
        , token: null
    };
    //进行装包操作,把本地的信息塞到core里,比如XXXid这些或者token
    if (sessionStorage.userid != null) {
        reqpack.core.userid = sessionStorage.userid;
    }
    if (sessionStorage.customerid != null) {
        reqpack.core.customerid = sessionStorage.customerid;
    }
    if (sessionStorage.token != null) {
        reqpack.token = sessionStorage.token;
    }
    if (sessionStorage.account != null) {
        reqpack.core.account = sessionStorage.account;
    }

    reqpack.data = data;
    //消息处理程序
    var msgHandler = function (pack) {
        switch (pack.msg.type) {
            case 0://空消息
                pack.msg.type = 1;
                break;
            case 1://系统默认消息
                console.log(pack.msg.data);
                break;
            case 2://系统异常消息
                console.error(pack.msg.data);
                break;
            case 3://控制客户端重定向
                location.href = pack.msg.data;
                pack.msg.type = 1;
                break;
            case 4://控制客户端弹出消息框
                // pack.msg.type = 1;
                alert(pack.msg.data);
                break;
            case 5://控制localstorage
                $.each(pack.msg.data, function (i, obj) {
                    sessionStorage.setItem(i, obj);
                });
                pack.msg.type = 1;
                break;
            case 9://控制客户端eval执行js脚本
                eval(pack.msg.data);
                break;
        }
    };
    $.ajax({
        type: "post",
        url: HOSTNAME + url,
        data: JSON.stringify(reqpack),
        dataType: 'json',
        cache:false,
        contentType: "application/json",
        processData: false,
        success: function (pack) {
            //进行解包操作,处理status
            switch (pack.status) {
                case 0://正常状态
                    //执行msg处理器
                    msgHandler(pack);
                    break;
                case -1://服务器异常状态
                    alert(pack.msg.data);
                    break;
                case 1://服务器繁忙状态
                    alert(pack.msg.data);
                    break;
                case 2://没有权限访问
                    alert(pack.msg.data);
                    break;
                case 3://找不到对应的业务
                    alert(pack.msg.data);
                    break;
            }

            fn(pack);
        },
        error: function (err) {
            console.log(JSON.stringify(err));
        }
    });
}

var logout_confrim = function () {
    $.confirm({
        theme: 'supervan',
        title: '',
        content: '' +
        '<input type="text" placeholder="账号" class="account form-control" required  style="margin-bottom: 10px;"/>' +
        '<input type="password" placeholder="xxxxxx" class="password form-control" required />'
        ,
        buttons: {
            formSubmit: {
                text: '登录',
                btnClass: 'btn-blue',
                action: function () {
                    var data = {
                        username: this.$content.find('.account').val()
                        , password: this.$content.find('.password').val()
                    }
                    if (!data.username || !data.password) {
                        $.alert('缺少参数');
                        return false;
                    } else {
                        req('/starLogin', data, function (result) {
                            console.log(result)
                            if (result.code == 1) {
                                sessionStorage.setItem('token', result.token);
                                return true;
                            }else {
                                alert("账户或密码错误！")
                                logout_confrim();
                            }
                        })
                    }

                }
            }
        }
    });
}

var logout = function () {
    localStorage.clear();
    sessionStorage.clear();
    logout_confrim();
};


if (!sessionStorage.token) {
    logout_confrim();
}
