window.onload = function() {


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
    var myuuid = Request.uuid;
    localStorage.setItem('wxarpt-my-clientId', myClientId);
    localStorage.setItem('wxarpt-other-uuid', myuuid);

    var c = document.getElementById("canvas_oil1");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.arc(50, 50, 45, -0.5 * Math.PI, 1.5 * Math.PI);
    ctx.stroke();

    var d = document.getElementById("canvas_oil2");
    var dtx = d.getContext("2d");
    dtx.beginPath();
    dtx.strokeStyle = 'rgb(238,48,119)';
    dtx.lineWidth = 5;

    var e = document.getElementById("canvas_water1");
    var etx = e.getContext("2d");
    etx.beginPath();
    etx.strokeStyle = 'red';
    etx.lineWidth = 5;
    etx.arc(50, 50, 45, -0.5 * Math.PI, 1.5 * Math.PI);
    etx.stroke();

    var f = document.getElementById("canvas_water2");
    var ftx = f.getContext("2d");
    ftx.beginPath();
    ftx.strokeStyle = 'rgb(238,48,119)';
    ftx.lineWidth = 5;

    $.get(service+'skinTest?uuid=' + localStorage.getItem("wxarpt-other-uuid") + '&mobile=' + localStorage.getItem("mobile")+ '&clientId=' + localStorage.getItem("wxarpt-my-clientId"), function(res) {
        console.log(res);
        var temp = res.looks;
        var result = {
            COLOR_FLAG: temp.COLOR_FLAG[0],
            INFLAMMATION_FLAG: temp.INFLAMMATION_FLAG[0],
            OIL_FLAG: temp.OIL_FLAG[0],
            PROSE_FLAG: temp.PROSE_FLAG[0],
            WATER_FLAG: temp.WATER_FLAG[0].toFixed(2),
            WRINKLES_FLAG: temp.WRINKLES_FLAG
        };
        var color_level = 0;
        var inflammation_level = 0;
        var inflammation = 100;
        var smoothy = 0;
        var smoothy_level = 0;
        var prose = 100;
        var oil_level = 0;
        var hasWrinkle = false;
        //判断图片地址是否有阿里云，没有就加上
        if( temp.image_path.indexOf('aliyuncs.com') == -1 ){
            $('#img').attr('src',service+'/' + temp.image_path);
        }else{
            $('#img').attr('src',temp.image_path);
        }
        // $('#img').attr('src', service+'/' + temp.image_path);

        if (localStorage.getItem('wxarpt-my-uuId') && localStorage.getItem('wxarpt-my-uuId') == localStorage.getItem('wxarpt-other-uuid')) {
            $('#result_button').css('display', 'block').unbind('click').click(function(e) {
                /*location.href = 'im_tool.html?uuid=' + localStorage.getItem("wxarpt-my-uuid") + '&mobile=' + localStorage.getItem("mobile") + '&clientId=' + localStorage.getItem("wxarpt-my-clientId");*/
                alert("请扫描下方二维码联系客服！")
            });

        } else {
            $('#test_button').css('display', 'block').unbind('click').click(function(e) {
                location.href = 'index.html?clientId=' + localStorage.getItem("wxarpt-my-clientId")+'&model='+skin;
            });
            $('.result_button_info').css('display', 'none');
        }

        // 判断皮肤属性
        // if (result.COLOR_FLAG >= 87.5) {
        //     color_level = 7;
        // } else if (result.COLOR_FLAG >= 75) {
        //     color_level = 6;
        // } else if (result.COLOR_FLAG >= 62.5) {
        //     color_level = 5;
        // } else if (result.COLOR_FLAG >= 50) {
        //     color_level = 4;
        // } else if (result.COLOR_FLAG >= 37.5) {
        //     color_level = 3;
        // } else if (result.COLOR_FLAG >= 25) {
        //     color_level = 2;
        // } else if (result.COLOR_FLAG >= 12.5) {
        //     color_level = 1;
        // } else {
        //     color_level = 0;
        // }

        // 判断皮肤属性
        if (result.COLOR_FLAG >= 87.5) {
            color_level = 7;
        } else if (result.COLOR_FLAG >= 75) {
            color_level = 6;
        } else if (result.COLOR_FLAG >= 62.5) {
            color_level = 5;
        } else if (result.COLOR_FLAG >= 50) {
            color_level = 4;
        } else if (result.COLOR_FLAG >= 37.5) {
            color_level = 3;
        } else if (result.COLOR_FLAG >= 25) {
            color_level = 2;
        } else if (result.COLOR_FLAG >= 12.5) {
            color_level = 1;
        } else {
            color_level = 0;
        }



        //强制改INFLAMMATION_FLAG
        if (result.COLOR_FLAG < 25)
        {
            if (result.INFLAMMATION_FLAG.length > 0 && result.INFLAMMATION_FLAG != "较轻" && result.INFLAMMATION_FLAG != "" && result.INFLAMMATION_FLAG != "无")
            {
                result.INFLAMMATION_FLAG = "较轻";
            }

        }
        console.log(result.INFLAMMATION_FLAG)

        // 判断炎症严重程度
        if (result.INFLAMMATION_FLAG == '较轻') {
            inflammation_level = 1;
            inflammation = 80;
        } else if (result.INFLAMMATION_FLAG == '中等') {
            inflammation_level = 2;
            inflammation = 70;
        } else if (result.INFLAMMATION_FLAG == '重') {
            inflammation_level = 3;
            inflammation = 50;
        } else if (result.INFLAMMATION_FLAG == '严重') {
            inflammation_level = 4;
            inflammation = 20;
        } else if(result.INFLAMMATION_FLAG == "无" || result.INFLAMMATION_FLAG == "" || !result.INFLAMMATION_FLAG){
            inflammation_level = 0;
            inflammation = 100;
            result.INFLAMMATION_FLAG = "较轻"
        } else if(result.INFLAMMATION_FLAG == '非常严重'){
            inflammation = 0;
            inflammation_level = 0;
        }





        // 判断皮肤光滑程度
        if (!!result.PROSE_FLAG) {
            if (result.PROSE_FLAG == "小")
                prose = 100;
            else if (result.PROSE_FLAG == "无" || result.PROSE_FLAG == "" || !result.PROSE_FLAG)
                prose = 100;
            else if (result.PROSE_FLAG == "较小")
                prose = 80;
            else if (result.PROSE_FLAG == "大")
                prose = 50;

            else if (result.PROSE_FLAG == "粗大")
                prose = 20;
        }
        var water = (100-Math.round(Math.abs(result.WATER_FLAG - .6).toFixed(2)*3*100))*0.4+60

        var smoothy = 0.35 *inflammation  + 0.35 * prose + 0.1 * water + 0.2 * (100-parseInt(result.COLOR_FLAG));
        if(smoothy >= 90){
            smoothy_level = 5;

        }
        else if (smoothy < 90 && smoothy >= 80) {
            smoothy_level = 4;
        } else if (smoothy < 80 && smoothy >= 70) {
            smoothy_level = 3;
        } else if (smoothy < 70 && smoothy >= 60) {
            smoothy_level = 2;
        } else if (smoothy < 60 && smoothy >= 50) {
            smoothy_level = 1;
        } else if(smoothy < 50){
            smoothy_level = 0;
        }
        console.log(smoothy_level)


        // 出油情况
        if (result.OIL_FLAG >= 87.5) {
            oil_level = 8;
        } else if (result.OIL_FLAG >= 75) {
            oil_level = 7;
        } else if (result.OIL_FLAG >= 62.5) {
            oil_level = 6;
        } else if (result.OIL_FLAG >= 50) {
            oil_level = 5;
        } else if (result.OIL_FLAG >= 37.5) {
            oil_level = 4;
        } else if (result.OIL_FLAG >= 25) {
            oil_level = 3;
        } else if (result.OIL_FLAG >= 12.5) {
            oil_level = 2;
        } else {
            oil_level = 1;
        }

        for (var i = 1; i < result.WRINKLES_FLAG.length; i++) {
            if (!!result.WRINKLES_FLAG[i]) {
                hasWrinkle = true;
            }
        }

        // if (inflammation > 80 && prose > 50 && !hasWrinkle) {
        //     skintype = "干性皮肤";
        // } else if (inflammation < 40 && prose <= 50) {
        //     skintype = "油性皮肤";
        // } else {
        //     skintype = "混合性皮肤";
        // }
        //限制炎症大小
        if (inflammation < 60){
            inflammation_level = 3;
        }
        console.log("inflammation="+inflammation,"water="+water,"水分="+result.WATER_FLAG,"油分="+result.OIL_FLAG,"prose="+prose,"炎症程度="+inflammation_level,"光滑度="+smoothy_level,"smoothy="+smoothy)
        if (water <75 && inflammation > 75 && prose > 80 ){
            skintype = "干性皮肤";
        }
        else if (result.OIL_FLAG>=0.17) {
            skintype = "油性皮肤";
        }else{
            skintype = "混合性皮肤";
        }
        $('#preresult_text').text(skintype);
        result.color_level = color_level;
        result.inflammation_level = inflammation_level;
        result.inflammation = inflammation;
        result.smoothy = smoothy;
        result.smoothy_level = smoothy_level;
        result.prose = prose;
        result.oil_level = oil_level;
        result.skintype = skintype;
        show(result);
    })



    getBDAddress(function(data) {
        if (!!data) {
            var temp = data.split(',');
            var myAddr = temp[1] + ',' + temp[2]
            console.log(myAddr);
            localStorage.setItem('myAddress', myAddr);
        }
    }, ',')

    function show(res) {
        // var result = JSON.parse(localStorage.getItem('result'));
        var result = res;
        var color_level = result.color_level;
        var inflammation_level = result.inflammation_level;
        var inflammation = result.inflammation;
        var smoothy = result.smoothy;
        var smoothy_level = result.smoothy_level;
        var prose = result.prose;
        var oil_level = result.oil_level;

        if (result.skintype == '干性皮肤') {
            $('#skin_dry').removeClass('total_skin_unselect').addClass('total_skin_select');
        } else if (result.skintype == '混合性皮肤') {
            $('#skin_mix').removeClass('total_skin_unselect').addClass('total_skin_select');
        } else {
            $('#skin_oil').removeClass('total_skin_unselect').addClass('total_skin_select');
        }

        // 判断炎症严重程度
        if (result.INFLAMMATION_FLAG == '较轻') {
            $('#pimple_text_low').addClass('pimple_text_selected');
        } else if (result.INFLAMMATION_FLAG == '中等') {
            $('#pimple_text_mid').addClass('pimple_text_selected');
        } else if (result.INFLAMMATION_FLAG == '重') {
            $('#pimple_text_mid').addClass('pimple_text_selected');
        } else if (result.INFLAMMATION_FLAG == '严重') {
            $('#pimple_text_hig').addClass('pimple_text_selected');
        } else {
            $('#pimple_text_hig').addClass('pimple_text_selected');
        }

        var ele = $('.smooth_symbol_level1');
        console.log(smoothy_level)
        for (var i = 0; i < smoothy_level; i++) {
            $(ele[i]).removeClass('smooth_symbol_level1').addClass('smooth_symbol_level2');
        }

        // 移动皮肤颜色游标
        $('#color_level').css({ 'position': 'relative', 'left': color_level * 0.7 + 1.3 + 'rem' }).text(color_level + 1 + '级');

        // 画出油份水分图形及显示数字
        $('#oil_point').text(Math.round(result.OIL_FLAG*100));
        dtx.arc(50, 50, 45, -0.5 * Math.PI, (result.OIL_FLAG * 2  - 0.5) * Math.PI);
        dtx.stroke();
        $('#water_point').text(Math.round(result.WATER_FLAG*100));
        ftx.arc(50, 50, 45, -0.5 * Math.PI, (result.WATER_FLAG * 2  - 0.5) * Math.PI);
        ftx.stroke();

        // 移动炎症游标
        $('#pimple_symbol').css({ 'left': inflammation_level + 'rem' });
        $('#pimple_level').css({ 'width': inflammation_level + 0.25 + 'rem' });


        $('#skin_symbol').text(oil_level + '级').css({ 'left': oil_level * 6 / 8 + 1.5 + 'rem' });
        $('#skin_level').css({ 'width': oil_level * 6 / 8 + 'rem' });

        /*$('#result_button').click(function(e) {
            location.href = "im_tool.html";
        });*/

        $('#skin_skin').text(result.skintype);
        $('#problem_value').text("毛孔中");
        console.log(result);
    }

}


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
        console.log(result);
        wx.config(result);
        // 2通过ready接口处理成功验证
        wx.ready(function() {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            //4获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
            wx.onMenuShareTimeline({
                title: '皮肤测试详细报告', // 分享标题
                link: location.href, // 分享链接
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
                link: location.href, // 分享链接
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



    // 地图和二维码
    $.get(service+'clientGetInfo?clientId=' + localStorage.getItem("wxarpt-my-clientId"), function(res) {
        console.log(res);
        var result = res.client;
        $('#map_detail').text(result.customerInfo);
        // $('#footer_qrcode').attr('src', 'http://106.75.64.209:8082/' + result.qrcode);
        if(result.qrcode){
            //判断图片地址是否有阿里云，没有就加上
            if( result.qrcode.indexOf('aliyuncs.com') == -1 ){
                $('#footer_qrcode').attr('src',service+'/' + result.qrcode);
            }else{
                $('#footer_qrcode').attr('src',result.qrcode);
            }
        }

        ShowMap("map", {
            city: '',
            addr: result.shopAddr,
            title: '',
            lawfirm: result.shopName,
            tel: '',
            pic: '',
            ismove: '0'
        });
});
