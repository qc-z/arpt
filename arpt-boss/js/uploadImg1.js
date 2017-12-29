
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
var service = "http://test.legle.cc/";

function send_request(){
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
        serverUrl = service+'getAdvertisementToken'
        xmlhttp.open( "GET", serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function check_object_radio(){
    g_object_name_type = 'random_name';
}

function get_signature(){
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

function random_string(len){
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

function calculate_object_name(filename){
    suffix = get_suffix(filename)
    g_object_name = key + random_string(10) + suffix
    return ''
}

function get_uploaded_object_name(filename){
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

function set_upload_param(up, filename, ret){
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
    preserve_headers:false,
    runtimes : 'html5,flash,silverlight,html4',
    browse_button : ['selectfiles',"selectfiles1","selectfiles2","selectfiles3","selectfiles4"],
    // multi_selection: false,
    container: document.getElementById('container'),
    flash_swf_url : './Moxie.swf',
    silverlight_xap_url : './Moxie.xap',
    url : 'http://oss.aliyuncs.com',

    filters: {
        // mime_types : [ //只允许上传图片和zip,rar文件
        // { title : "Image files", extensions : "jpg,png,jpeg,JPG,PNG,JPEG" },
        // { title : "Zip files", extensions : "zip,rar" }
        // ],
        max_file_size : '10mb', //最大只能上传10mb的文件
        prevent_duplicates : true //不允许选取重复文件
    },
    resize: {
        width:500,
        height:500,
        crop: false,
        quality: 90,    //图片的质量,默认90
        preserve_headers: false
    },

    init: {
        PostInit: function() {
            document.getElementById('postfiles').onclick = function() {
                set_upload_param(uploader, '', false);
                add(imgUrl)
                return false;
            };
        },

        FilesAdded: function(up, files) {
            set_upload_param(uploader, '', false);
            /*console.log(lastFile+'====='+ files[0].name)
            if( files[0].name == lastFile ){
                alert("请不要选择重复的图片！")
            }else{
                //添加广告机显示进度条
                plupload.each(files, function(file) {
                    document.getElementById('ossfile').innerHTML += '<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ')<b></b>'
                    +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div>'
                    +'</div>';
                });

                lastFile = files[0].name;
            }*/
        },

        BeforeUpload: function(up, file) {
            check_object_radio();
            set_upload_param(up, file.name, true);
        },

        /*UploadProgress: function(up, file) {
            var d = document.getElementById(file.id);
            d.getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
            var prog = d.getElementsByTagName('div')[0];
            var progBar = prog.getElementsByTagName('div')[0]
            progBar.style.width= file.percent+'100%';
            progBar.setAttribute('aria-valuenow', file.percent);
        },*/

        FileUploaded: function(up, file, info) {
            console.log(file.name)
            if (info.status == 200)
            {
                imgUrl = get_uploaded_object_name(file.name) || "";
                console.log(imgUrl);
                $("#img1").attr("src","http://arpt-user.oss-cn-shenzhen.aliyuncs.com/"+imgUrl).css("display","block");
                $("#img11").attr("src","http://arpt-user.oss-cn-shenzhen.aliyuncs.com/"+imgUrl).css("display","block");

                /*if(up.settings.id == 'selectfiles2'){
                    $("#selectfiles2").css("background-image","url(http://arpt-user.oss-cn-shenzhen.aliyuncs.com/"+imgUrl+")");
                }else if(up.settings.id == 'selectfiles3'){
                    $("#selectfiles3").css("background-image","url(http://arpt-user.oss-cn-shenzhen.aliyuncs.com/"+imgUrl+")");
                }else if(up.settings.id == 'selectfiles4'){
                    $("#selectfiles4").css("background-image","url(http://arpt-user.oss-cn-shenzhen.aliyuncs.com/"+imgUrl+")");
                }*/

                // $("#img3").attr("src","http://arpt-user.oss-cn-shenzhen.aliyuncs.com/"+imgUrl).css("display","block");
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
                var flag = false
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
                // $("#img1").attr("src",fr.result).css("display","block");
                console.log(file.imgsrc)
                fr.destroy();
                fr = null;
            }
            fr.readAsDataURL(file.getSource());
        } else {
            var preloader = new mOxie.Image();
            preloader.onload = function () {
                preloader.downsize(500, 500);//先压缩一下要预览的图片
                var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                // $("#img1").attr("src",imgsrc).css("display","block");
                imgg = imgsrc;
                preloader.destroy();
                preloader = null;
            };
            preloader.load(file.getSource());
        }
    });
});


window.onload = function(){

    $.ajax({
        type: "GET",
         url: serve + "/getAdvertisementList",
        //url: "http://10.0.0.143:4300/getProjectList",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (res) {
            if(res.code == 1){
                var msg = res.results;
                // console.log(msg);
                var str = "";
                str += "<tbody>"
                    str += "<tr>"
                        str += "<th>工具类型</th>"
                        str += "<th>版本类型</th>"
                        str += "<th>链接</th>"
                        str += "<th>广告名称</th>"
                        str += "<th>广告图片</th>"
                        str += "<th>修改</th>"
                        str += "<th>删除</th>"
                    str += "<tr>"
                for(var i = 0;i < msg.length;i++){
                    str += "<tr>"
                        str += "<td class='toolType'>"+msg[i].toolType+"</td>"
                        str += "<td class='editionType'>"+msg[i].editionType+"</td>"
                        str += "<td class='adUrl'>"+msg[i].adUrl+"</td>"
                        str += "<td class='adName'>"+msg[i].adName+"</td>"
                        str += "<td><img class='img' src="+msg[i].imgUrl+"></td>"
                        str += "<td onclick='upmodel()' data-id="+msg[i]._id+" class='rew'><img class='pics' src=imgs/rewrite.jpg></td>"
                        str += "<td data-id="+msg[i]._id+" class='del'><img class='pics' src=imgs/delete.jpg></td>"
                    str += "<tr>"
                }
                str += "</tbody>"
                // console.log(str)
                $("#insert").append($(str));
            }
        },
        error: function () {
        }
    });

    //删除广告
    $("#insert").on("click",".del",function(){
        id = $(this).attr("data-id");
        console.log(id)
        $.ajax({
            type: "GET",
             url: service + "deleteAdvertisement?toolId="+id,
            //url: "http://10.0.0.143:4300/getProjectList",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (res) {
                console.log(res)
                if(res.code == 1){
                    alert("删除成功");
                    window.location.reload();
                }else{
                    alert("删除失败")
                }
            }
        })
    })

    //编辑广告
    $("#insert").on("click",".rew",function(){
        id = $(this).attr("data-id");
        // var tr = $(this).parent();
        //原本信息
        var toolTypes = $(this).parent().find(".toolType").html();
        var editionTypes = $(this).parent().find(".editionType").html();
        var adUrls = $(this).parent().find(".adUrl").html();
        var adNames = $(this).parent().find(".adName").html();
        var imgs = $(this).parent().find(".img").attr("src");
        console.log("修改前"+adUrls,toolTypes,editionTypes,adNames,imgs,id);
        //填写在页面
        //给图片链接赋值
        $("#link1").val(adUrls);
        //给广告名称赋值
        $("#names1").val(adNames);
        //给工具类型下拉框赋值
        // for(var i = 0;i < $("#type1 option").length;i++){
        //   if($($("#type1 option")[i])[0].text == toolTypes){
        //       $($("#type1 option")[i])[0].selected = true;
        //   }
        // }
        //给版本类型下拉框赋值
        for(var i = 0;i < $("#tool1 option").length;i++){
            if($($("#tool1 option")[i])[0].text == editionTypes){
                $($("#tool1 option")[i])[0].selected = true;
            }
        }
        //给展示图片src
        $("#img11").attr("src",imgs).css("display","block");

        //修改按钮点击确认
        $("#postfiles1").click(function(){
            if($("#img11").attr("src") == imgs){
                console.log(imgs.split("http://arpt-user.oss-cn-shenzhen.aliyuncs.com/")[1]);
                let imgUrl = imgs.split("http://arpt-user.oss-cn-shenzhen.aliyuncs.com/")[1];
            }
            var adUrl = $("#link1").val();
            var toolType = $('#type1 option:selected').val();
            var editionType = $('#tool1 option:selected').val();
            var adName = $('#names1').val();
            console.log("修改后"+adUrl,toolType,editionType,adName,imgUrl,id);
            if(adUrl && toolType && editionType && adName){
                $.ajax({
                    type: "POST",
                    url: serve + "/editAdvertisement",
                    dataType: 'json',
                    data: {
                        "imgUrl": imgUrl,
                        "adUrl": adUrl,
                        "toolType": toolType,
                        "editionType":editionType,
                        "adName":adName,
                        "toolId":id
                    } ,
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    success: function (data) {
                        if(data.code){
                            alert("修改成功");
                            window.location.reload();
                        }
                    },
                    error: function () {
                    }
                });
            }else{
                alert("参数不完整");
                return;
            }
        })
    })
}

//添加广告
function add(imgUrl){
    // console.log(imgUrl)
    var AdUrl = $("#link").val();
    var ToolType = $('#type option:selected').val();
    var EditionType = $('#tool option:selected').val();
    var adName = $('#names').val();
    var data = {
        "imgUrl": imgUrl,
        "adUrl": AdUrl,
        "toolType": ToolType,
        "editionType":EditionType,
        "adName":adName
    }
    if(typeof imgUrl == "undefined"){
        alert("参数不完整");
        return;
    }

    if(imgUrl && AdUrl && ToolType && adName && EditionType){
        $.ajax({
            type: "POST",
            url: serve + "/addAdvertisement",
            dataType: 'json',
            data: data,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                if(data.code == 1){
                    alert("添加成功");
                    window.location.reload();
                }else{
                    alert(data.err);
                }
            },
            error: function () {
            }
        });
    }else{
        alert("参数不完整");
        return;
    }
}

// 添加广告机
function adExample(){
    console.log("添加广告机")
}
$('#adClick').on('click',function(){
    // document.getElementById('ossfile').innerHTML = '';
})

//模态框启动事件
function upmodel(){
    // console.log($(this))
    $("#click1").trigger("click");
}
