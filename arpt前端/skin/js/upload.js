
accessid = ''
accesskey = ''
host = ''
policyBase64 = ''
signature = ''
callbackbody = ''
filename = ''
key = ''
expire = 0
g_object_name = ''
g_object_name_type = ''
now = timestamp = Date.parse(new Date()) / 1000;
function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    if (xmlhttp!=null)
    {
        serverUrl = service+'getSkinToken'
        xmlhttp.open( "GET", serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function check_object_radio() {
    g_object_name_type = 'random_name';
}

function get_signature()
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3)
    {
        body = send_request()
        var obj = eval ("(" + body + ")");
        // console.log(obj)
        host = obj['host']
        policyBase64 = obj['policy']
        accessid = obj['accessId']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        callbackbody = obj['callback']
        key = obj['dir']
        return true;
    }
    return false;
};

function random_string(len) {
　　len = len || 32;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　var maxPos = chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename)
{

    suffix = get_suffix(filename)
    g_object_name = key + random_string(10) + suffix
    return ''
}

function get_uploaded_object_name(filename)
{
    // console.log(filename)
    if (g_object_name_type == 'local_name')
    {
        tmp_name = g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
    }
    else if(g_object_name_type == 'random_name')
    {
        return g_object_name
    }
}

function set_upload_param(up, filename, ret)
{
    if (ret == false)
    {
        ret = get_signature()
    }
    g_object_name = key;
    if (filename != '') {
        suffix = get_suffix(filename)
        calculate_object_name(filename)
    }
    new_multipart_params = {
        'key' : g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
        'callback' : callbackbody,
        'signature': signature,
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
}

var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'selectfiles',
    //multi_selection: false,
	container: document.getElementById('container'),
	flash_swf_url : './Moxie.swf',
	silverlight_xap_url : './Moxie.xap',
    url : 'http://oss.aliyuncs.com',
    multi_selection:false,  // 只能选择单个文件
    filters: {
        // mime_types : [ //只允许上传图片和zip,rar文件
        // { title : "Image files", extensions : "jpg,png,jpeg,JPG,PNG,JPEG" },
        // { title : "Zip files", extensions : "zip,rar" }
        // ],
        max_file_size : '10mb', //最大只能上传10mb的文件
        prevent_duplicates : true //不允许选取重复文件
    },
    

	init: {
		PostInit: function() {

			// document.getElementById('ossfile').innerHTML = '';
			document.getElementById('postfiles').onclick = function() {
                set_upload_param(uploader, '', false);
                add(data);
                return false;
			};
            // $("[type=file]").click = function() {
            //     set_upload_param(uploader, '', false);
            //     return false;
            // };
		},

		FilesAdded: function(up, files) {
            // console.log(up)
            set_upload_param(uploader, '', false);
			// plupload.each(files, function(file) {
			// 	document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
			// 	+'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
			// 	+'</div>';
			// });

		},

		BeforeUpload: function(up, file) {
            check_object_radio();
            set_upload_param(up, file.name, true);

        },

		UploadProgress: function(up, file) {
			// var d = document.getElementById(file.id);
			// d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
   //          var prog = d.getElementsByTagName('div')[0];
			// var progBar = prog.getElementsByTagName('div')[0];

			// progBar.style.width= file.percent+'%';
   //          console.log(file.percent)
			// progBar.setAttribute('aria-valuenow', file.percent);


		},

		FileUploaded: function(up, file, info) {
            if (info.status == 200)
            {
                // document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = 'upload to oss success, object name:' + get_uploaded_object_name(file.name);
                // var data = {
                //     "uuid": localStorage.getItem('wxarpt-my-uuid') || "",
                //     "clientId": localStorage.getItem('wxarpt-my-clientid'),
                //     "mobile": localStorage.getItem('mobile') || "",
                //     url:get_uploaded_object_name(file.name)
                // }
                console.log(get_uploaded_object_name(file.name))
                $("#selectfiles").css("background-image","url(http://arpt-user.oss-cn-shenzhen.aliyuncs.com/"+get_uploaded_object_name(file.name)+")")
                $("#selectfiles").css("background-size","cover")
                //http://arpt-user.oss-cn-shenzhen.aliyuncs.com/
                data = {
                    "uuid": "",
                    "clientId": localStorage.getItem('wxarpt-my-clientId') || "",
                    "mobile": "",
                    file:get_uploaded_object_name(file.name)
                }
                // $.post(service+"skinTestUrl",data,function(res){

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
    // var myClientId = "591970961503ff63d504db75";
    localStorage.setItem('wxarpt-my-clientId', myClientId);

    /*init webuploader*/
    var $btn = $("#ctlBtn"); //开始上传

    var sure_btn = $('#sure_btn');
    var get_code = $('#get_code');
    var number = $('#s_number');
    var code = $('#s_code');




    var flag = false
    $btn.unbind('click').click(function() {
        if(!flag){
            alert("请选择图片！");
            retrun;
        }else{
            uploader.upload();
        }



    get_code.unbind('click').click(function(e) {
        if (number.val().length == 11) {
            if (get_code.hasClass('get_code')) {
                $.get(service+'sendVerifyCode?mobile=' + number.val(), function(res) {
                localStorage.setItem('mobile', number.val());
                    if (res.code == 1) {
                        // console.log(res)
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
        // localStorage.setItem('mobile', number.val());
        if (number.val().length == 11 && code.val().length > 0) {
            //校对验证码
        //     $.post('http://106.75.64.209:8082/userVerifyMobile',{uuid:localStorage.getItem('wxarpt-my-uuId') || "",mobile:number.val(),code:code.val(),clientId:localStorage.getItem('wxarpt-my-clientId')},function (result) {
        //             console.log(result);
        // })

            $.post(service+'userVerifyMobile', {
                "uuid": localStorage.getItem('wxarpt-my-uuId') || "",
                "clientId": localStorage.getItem('wxarpt-my-clientId') || "",
                "mobile": number.val(),
                "code": code.val(),
                "type":"skin",
            }, function(res) {
                console.log(res);
                if(res.code==1)
                {

                    location.href = "report.html?uuid="+localStorage.getItem('wxarpt-my-uuId')+'&clientId='+localStorage.getItem('wxarpt-my-clientId')+'&model='+skin;
                }
                else
                {
                    console.log(localStorage.getItem('wxarpt-my-uuId'))
                    alert("验证码不正确");
                    return;
                }
                number.val() == '';
                code.val() == '';
                // localStorage.setItem('wxarpt-my-clientId', res.clientId);
                // localStorage.setItem('wxarpt-my-uuid', res.uuid);
                // location.href = './report.html?uuid=' + localStorage.getItem('wxarpt-my-uuid') + '&clientId=591970961503ff63d504db75';
                // location.href = './report.html?uuid=' + localStorage.getItem('wxarpt-my-uuId') + '&clientId=' + localStorage.getItem('wxarpt-my-clientId');
            })
        } else {
            alert('手机号码必须是11位！');
        }
    });
                })
            }
            else
            {
                document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                // console.log(info.response)
            }
		},

		Error: function(up, err) {
            if (err.code == -600) {
                document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
            }
            else if (err.code == -601) {
                document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
            }
            else if (err.code == -602) {
                document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
            }
            else
            {
                document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
            }
		}
	}
});




uploader.init();

uploader.bind('FilesAdded',function(uploader,addFiles){



    // 对addFiles分别生成base64编码，用于预览
    $.each(addFiles || [], function(i, file) {

        if (!file || !/image\//.test(file.type)) return; //确保文件是图片
        if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
            var fr = new mOxie.FileReader();
            fr.onload = function () {
                file.imgsrc = fr.result;
                // $("#selectfiles").css("background-image","url("+fr.result+")")
                fr.destroy();
                fr = null;
            }
            fr.readAsDataURL(file.getSource());
        } else {
            var preloader = new mOxie.Image();
            preloader.onload = function () {
                preloader.downsize(300, 300);//先压缩一下要预览的图片
                var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                // $("#selectfiles").css("background-image","url("+imgsrc+")")
                file.imgsrc = imgsrc;
                preloader.destroy();
                preloader = null;
            };
            preloader.load(file.getSource());
        }

    });
});

 // // // //转base64
 // var s_input = document.getElementsByTagName('input')[2];
 // s_input.addEventListener('change', showBase64, false);
 // function showBase64() {
 //     var file = this.files[0];
 //     var reader = new FileReader();
 //     reader.readAsDataURL(file);
 //     reader.onload = function() {
 //         photo = this.result;
 //         console.log(photo)
 //     }
 // }

function add(data){
    $.post(service+"skinTestUrl",data,function(res){
        console.log(res)
                var temp = res.skin;
                localStorage.setItem('wxarpt-my-uuId', res.uuid);
                // uuuid = res.uuid;
                // console.log(temp)
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
                        inflammation = 50;
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
                    console.log(skintype)
                $('#preresult_text').text(skintype);
                // console.log(skintype)
                result.color_level = color_level;
                result.inflammation_level = inflammation_level;
                result.inflammation = inflammation;
                result.smoothy = smoothy;
                result.smoothy_level = smoothy_level;
                result.prose = prose;
                result.oil_level = oil_level;
                result.skintype = skintype;
                console.log(result)
                $('.loading_text span:first').css({ 'display': 'none' })
                $('#s_complete').css({ 'display': 'block' });
                $('#preresult').css({ 'display': 'block' });
                $('.header').css({ 'display': 'none' });

                localStorage.setItem('result', JSON.stringify(result));
                $('#s_body').css({ 'display': 'none' });
                $("[id=choose]")
                $('#s_mobile').css({ 'display': 'block', 'position': 'absolute', 'top': "0px" ,"z-index":9999});
                $("#s_number").val("");
                $("#s_code").val("");
    })


}
