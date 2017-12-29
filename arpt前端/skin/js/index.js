window.onload = function() {
    // 获取url,因为下面的clientId需要从url中拿，所以要写在声明前面
    function UrlSearch() {
        var name, value;
        var str = location.href; //取得整个地址栏
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]
        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                this[name] = value;    
            }   
        }
    }
    var Request = new UrlSearch(); //实例化
    var myClientId = Request.clientId;
    localStorage.setItem('wxarpt-my-clientId', myClientId);

    /*init webuploader*/
    var $btn = $("#ctlBtn"); //开始上传

    var sure_btn = $('#sure_btn');
    var get_code = $('#get_code');
    var number = $('#s_number');
    var code = $('#s_code');

    // var uploader = WebUploader.create({
    //     // 选完文件后，是否自动上传。
    //     auto: false,
    //     // swf文件路径
    //     swf: 'css/Uploader.swf',
    //     // 文件接收服务端。
    //     server: 'http://arpt.leglear.com:82/skinTest',
    //     // server: 'http://10.0.0.154:3002/testy',
    //     // 选择文件的按钮。可选。
    //     // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    //     pick: '#filePicker',
    //     formData: {
    //         data: JSON.stringify({
    //             "uuid": localStorage.getItem('wxarpt-my-uuid') || "",
    //             "clientId": localStorage.getItem('wxarpt-my-clientid'),
    //             "mobile": localStorage.getItem('mobile') || ""
    //         })
    //     },
    //     // 只允许选择图片文件。
    //     accept: {
    //         title: 'Images',
    //         extensions: 'gif,jpg,jpeg,bmp,png',
    //         mimeTypes: 'image/*'
    //     },
    //     method: 'POST'
    // });
    // 当有文件添加进来的时候
    // uploader.on('fileQueued', function(file) { // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
    //     // 创建缩略图
    //     // 如果为非图片文件，可以不用调用此方法。
    //     uploader.makeThumb(file, function(error, src) { //webuploader方法
    //         if (error) {
    //             alert('不能预览');
    //             return;
    //         }
    //         localStorage.setItem('pic', src);
    //         $('#imgs').attr('src', src);
    //         flag = true;
    //     }, 400, 400);
    // });
    // // 文件上传过程中创建进度条实时显示。
    // uploader.on('uploadProgress', function(file, percentage) {});

    // // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    // uploader.on('uploadSuccess', function(file, res) {
    //     var temp = res.skin;
    //     localStorage.setItem('wxarpt-my-uuid', res.uuid);
    //     console.log(temp)
    //     var result = {
    //         COLOR_FLAG: temp.COLOR_FLAG[0],
    //         INFLAMMATION_FLAG: temp.INFLAMMATION_FLAG[0],
    //         OIL_FLAG: Math.round(temp.OIL_FLAG[0] * 100),
    //         PROSE_FLAG: temp.PROSE_FLAG[0],
    //         WATER_FLAG: Math.round(temp.WATER_FLAG[0] * 100),
    //         WRINKLES_FLAG: temp.WRINKLES_FLAG
    //     };
    //     var color_level = 0;
    //     var inflammation_level = 0;
    //     var inflammation = 0;
    //     var smoothy = 0;
    //     var smoothy_level = 0;
    //     var prose = 0;
    //     var oil_level = 0;
    //     var hasWrinkle = false;

    //     // 判断皮肤属性
    //     if (result.COLOR_FLAG >= 87.5) {
    //         color_level = 7;
    //     } else if (result.COLOR_FLAG >= 75) {
    //         color_level = 6;
    //     } else if (result.COLOR_FLAG >= 62.5) {
    //         color_level = 5;
    //     } else if (result.COLOR_FLAG >= 50) {
    //         color_level = 4;
    //     } else if (result.COLOR_FLAG >= 37.5) {
    //         color_level = 3;
    //     } else if (result.COLOR_FLAG >= 25) {
    //         color_level = 2;
    //     } else if (result.COLOR_FLAG >= 12.5) {
    //         color_level = 1;
    //     } else {
    //         color_level = 0;
    //     }


    //     // 判断炎症严重程度
    //     if (result.INFLAMMATION_FLAG == '较轻') {
    //         inflammation_level = 1;
    //         inflammation = 100;
    //     } else if (result.INFLAMMATION_FLAG == '中等') {
    //         inflammation_level = 2;
    //         inflammation = 80;
    //     } else if (result.INFLAMMATION_FLAG == '重') {
    //         inflammation_level = 3;
    //         inflammation = 40;
    //     } else if (result.INFLAMMATION_FLAG == '严重') {
    //         inflammation_level = 4;
    //         inflammation = 20;
    //     } else {
    //         inflammation_level = 5;
    //         inflammation = 0;
    //     }


    //     // 判断皮肤光滑程度
    //     if (!!result.PROSE_FLAG) {
    //         if (result.PROSE_FLAG == "小")
    //             prose = 100;
    //         else if (result.PROSE_FLAG == "较小")
    //             prose = 80;
    //         else if (result.PROSE_FLAG == "大")
    //             prose = 50;

    //         else if (result.PROSE_FLAG == "粗大")
    //             prose = 20;
    //     }

    //     smoothy = 0.35 * inflammation + 0.35 * prose + 0.1 * result.WATER_FLAG + 0.2 * result.COLOR_FLAG;

    //     if (smoothy >= 80) {
    //         smoothy_level = 5;
    //     } else if (smoothy >= 60) {
    //         smoothy_level = 4;
    //     } else if (smoothy >= 40) {
    //         smoothy_level = 3;
    //     } else if (smoothy >= 20) {
    //         smoothy_level = 2;
    //     } else {
    //         smoothy_level = 1;
    //     }

    //     // 出油情况
    //     if (result.OIL_FLAG >= 87.5) {
    //         oil_level = 8;
    //     } else if (result.OIL_FLAG >= 75) {
    //         oil_level = 7;
    //     } else if (result.OIL_FLAG >= 62.5) {
    //         oil_level = 6;
    //     } else if (result.OIL_FLAG >= 50) {
    //         oil_level = 5;
    //     } else if (result.OIL_FLAG >= 37.5) {
    //         oil_level = 4;
    //     } else if (result.OIL_FLAG >= 25) {
    //         oil_level = 3;
    //     } else if (result.OIL_FLAG >= 12.5) {
    //         oil_level = 2;
    //     } else {
    //         oil_level = 1;
    //     }

    //     for (var i = 1; i < result.WRINKLES_FLAG.length; i++) {
    //         if (!!result.WRINKLES_FLAG[i]) {
    //             hasWrinkle = true;
    //         }
    //     }

    //     if (inflammation > 80 && prose > 50 && !hasWrinkle) {
    //         skintype = "干性皮肤";
    //     } else if (inflammation < 40 && prose <= 50) {
    //         skintype = "油性皮肤";
    //     } else {
    //         skintype = "混合性皮肤";
    //     }

    //     $('#preresult_text').text(skintype);

    //     result.color_level = color_level;
    //     result.inflammation_level = inflammation_level;
    //     result.inflammation = inflammation;
    //     result.smoothy = smoothy;
    //     result.smoothy_level = smoothy_level;
    //     result.prose = prose;
    //     result.oil_level = oil_level;
    //     result.skintype = skintype;
    //     $('.loading_text span:first').css({ 'display': 'none' })
    //     $('#s_complete').css({ 'display': 'block' });
    //     $('#preresult').css({ 'display': 'block' });
    //     // localStorage.setItem('result', JSON.stringify(result));
    // });

    // // 文件上传失败，显示上传出错。
    // uploader.on('uploadError', function(file) {
    //     alert('上传失败,请重试！');
    //     location.reload();
    // });

    // // 完成上传完了，成功或者失败，先删除进度条。
    // uploader.on('uploadComplete', function(file) {});


    var flag = false
    $btn.unbind('click').click(function() {
        if(!flag){
            alert("请选择图片！");
            retrun;
        }else{
            uploader.upload();
        }

        $('#s_body').css({ 'visibility': 'hidden' });
        $('#s_mobile').css({ 'display': 'block', 'position': 'absolute', 'top': $('#s_body')[0].offsetTop });
    });

    get_code.unbind('click').click(function(e) {
        if (number.val().length == 11) {
            if (get_code.hasClass('get_code')) {
                $.get(service+'sendVerifyCode?mobile=' + number.val(), function(res) {
                    if (res.code == 1) {
                        get_code.removeClass('get_code').addClass('get_code_dis');
                        var num = 60;
                        var timer = null;
                        get_code.text(num + '秒');
                        num--;
                        timer = setInterval(function() {
                            get_code.text(num + '秒');
                            num--;
                            if (num < 0) {
                                get_code.removeClass('get_code_dis').addClass('get_code');
                                get_code.text('获取验证码');
                                clearInterval(timer);
                            }
                        }, 1000);
                    }
                });
            }
        } else {
            alert('手机号码必须是11位！');
        }
    });

    sure_btn.unbind('click').click(function(e) {
        if (number.val().length == 11 && code.length > 0) {
            $.post(service+'userVerifyMobile', {
                "uuid": localStorage.getItem('wxarpt-my-uuid') || "",
                "clientId": localStorage.getItem('wxarpt-my-clientId'),
                "mobile": number.val(),
                "code": code.val()
            }, function(res) {
                console.log(res);
                number.val() == '';
                code.val() == '';
                // localStorage.setItem('wxarpt-my-clientId', res.clientId);
                // localStorage.setItem('wxarpt-my-uuid', res.uuid);
                localStorage.setItem('mobile', res.mobile);
                location.href = './report.html?uuid=' + localStorage.getItem('wxarpt-my-uuId') + '&clientId=' + localStorage.getItem('wxarpt-my-clientId')+'&model='+skin;
            })
        } else {
            alert('手机号码必须是11位！');
        }
    });

    //微信转发
    $.post(service+"weixin/share", { url: location.href }, function(result) {
        //     {
        //   appId: wxConfig.appId,
        //   timestamp: timestamp,
        //   nonceStr: noncestr,
        //   signature: string1
        // }
        // 1通过config接口注入权限验证配置
        result.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage'];
        // result.debug = true;
        // console.log(result);
        wx.config(result);
        // 2通过ready接口处理成功验证
        wx.ready(function() {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            //4获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                title: '皮肤测试详细报告', // 分享标题
                link: 'http://arpt.leglear.com/skin/index.html?clientId='+localStorage.getItem("wxarpt-my-clientid")+'&model='+skin, // 分享链接
                imgUrl: 'http://ok9tyhimw.bkt.clouddn.com/wxsharelogo.jpg', // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
            //5获取“分享给朋友”按钮点击状态及自定义分享内容接口
            wx.onMenuShareAppMessage({
                title: '皮肤测试详细报告', // 分享标题
                desc: '看看我的皮肤怎么样', // 分享描述
                link: 'http://arpt.leglear.com/skin/index.html?clientId='+localStorage.getItem("wxarpt-my-clientid")+'&model='+skin, // 分享链接
                imgUrl: 'http://ok9tyhimw.bkt.clouddn.com/wxsharelogo.jpg', // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });

        });
    })

}
