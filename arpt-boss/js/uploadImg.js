
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
var service = "http://arpt.leglear.com:82/";
var imgObj = {};
var temp = "";
imgObj.roll = [];
var isSuccess = 1;
//判断是否有ar广告
var isArad = 0;
//判断是否有web广告
var isWebad = 0;
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

var ids = new Array("selectfiles","selectfiles1","selectfiles2","selectfiles3","selectfiles4","selectfiles5","selectfiles6","selectfiles7","selectfiles21","selectfiles31","selectfiles41","selectfiles51","selectfiles61","selectfiles71");
$.each(ids,function(i,n){
    var self = this.toString();
    //实例化一个plupload上传对象
    var uploader = new plupload.Uploader({
        preserve_headers:false,
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : self,
        container: document.getElementById('container'),
        flash_swf_url : './Moxie.swf',
        silverlight_xap_url : './Moxie.xap',
        url : 'http://oss.aliyuncs.com',


        filters: {

            max_file_size : '200mb', //最大只能上传10mb的文件
            prevent_duplicates : true, //不允许选取重复文件
            mime_types : [ //只允许上传图片和zip,rar文件
        { title : "Image files", extensions : "jpg,png,jpeg" },
        { title : "video files", extensions : "mp4,avi,rmvb" }
        ]
        },

        multi_selection:false,
    });

    //在实例对象上调用init()方法进行初始化
    uploader.init({

    });

    uploader.bind('PostInit',function(){
        document.getElementById('postfiles').onclick = function() {
            set_upload_param(uploader, '', false);
            add(imgUrl);
            return false;
        };
    });

    //绑定各种事件，并在事件监听函数中做你想做的事.当文件添加进来时

        uploader.bind('FilesAdded',function(uploader,files){

        set_upload_param(uploader, '', false);
        // 添加广告预览图
        plupload.each(files, function(file) {
            previewImage(file,function(imgsrc){
                $("#img1").attr("src",imgsrc).css("display","block");
                $("#img11").attr("src",imgsrc).css("display","block");
            })
        })
        if(self.search('selectfiles2')===0){ // 添加广告机轮播图，不限制数量
            temp = "roll";
            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $('#IMG31').append('<br/><img  src='+ imgsrc +' /><hr>');
                    // $("#IMG31").css("display","none")
                });
            });
        }else if(self.search('selectfiles4')===0){ // 皮肤测试图片
            if($('#IMG51').find('img').length>=1){
                layer.confirm('只能上传1张图片');
                return false;
            }
            temp = "skin";
            plupload.each(files, function(file) {
                console.log(file)
                previewImage(file,function(imgsrc){
                    $('#IMG51').append('<br/><img src="'+ imgsrc +'" />');
                    // $("#IMG51").css("display","none")

                });

            });

        }else if(self.search('selectfiles5')===0){ // 颜值测试图片
            if($('#IMG61').find('img').length>=1){
                layer.confirm('只能上传1张图片');
                return false;
            }
            temp = "face";
            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $('#IMG61').append('<br/><img src="'+ imgsrc +'" />');
                    // $("#IMG61").css("display","none")

                });

            });

        }else if(self.search('selectfiles7')===0){ // 实时预览图片
            if($('#IMG71').find('img').length>=1){
                layer.confirm('只能上传1张图片');
                return false;
            }
            temp = "live";

            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $('#IMG71').append('<br/><img src="'+ imgsrc +'" />');
                    // $("#IMG71").css("display","none")

                });

            });

        }else if(self.search('selectfiles6')===0){ // 视频
            if($('#IMG81').find('img').length>=1){
                layer.confirm('只能上传1个视频');

                return false;
            }
            temp = "video";

            plupload.each(files, function(file) {
                $('#IMG81').append('<br/><img style="width: 10rem;height: 10rem;" src="../arpt-boss/images/loading.gif" class="wait">');
                $('#IMG81').append('<br/><span class="ing" style="color:#cc3d3d">视频上传中，视频较大，请耐心等待，请不要操作页面</span>');

            });

        }
        else if(self.search('selectfiles3')===0){ // 广告机公司信息
            if($('#IMG41').find('img').length>=1){
                layer.confirm('只能上传1张图片');

                return false;
            }
            temp = "info";
            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $('#IMG41').append('<br/><img  src="'+ imgsrc +'" />');
                    // $("#IMG41").css("display","none")

                });

            });

        }


        //修改广告

        if(self.search('selectfiles21')===0){ // 添加广告机轮播图，不限制数量
            temp = "roll";
            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $("#IMG3 .imgnone").css("display","none")
                    $("#IMG3 .hrnone").css("display","none")
                    $('#IMG3').append('<br/><img  src='+ imgsrc +' />');
                });
            });
        }else if(self.search('selectfiles41')===0){ // 皮肤测试图片

            temp = "skin";
            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $("#IMG5 img").css("display","none")
                    $("#IMG5 br").css("display","none")
                    $('#IMG5').append('<br/><img src="'+ imgsrc +'" />');

                });

            });

        }else if(self.search('selectfiles51')===0){ // 颜值测试图片

            temp = "face";
            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $("#IMG6 img").css("display","none")
                    $("#IMG6 br").css("display","none")
                    $('#IMG6').append('<br/><img src="'+ imgsrc +'" />');

                });

            });

        }else if(self.search('selectfiles71')===0){ // 实时预览图片

            temp = "live";
            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $("#IMG7 img").css("display","none")
                    $("#IMG7 br").css("display","none")
                    $('#IMG7').append('<br/><img src="'+ imgsrc +'" />');

                });

            });

        }else if(self.search('selectfiles61')===0){ // 视频
            temp = "video";
            plupload.each(files, function(file) {
                $(".success").css("display","none");
                $('#IMG8').append('<br/><img style="width: 10rem;height: 10rem;" src="../arpt-boss/images/loading.gif" class="wait">');
                $('#IMG8').append('<br/><span class="ing" style="color:#cc3d3d">视频上传中，视频较大，请耐心等待，请不要操作页面</span>');
                
            });

        }
        else if(self.search('selectfiles31')===0){ // 广告机公司信息

            temp = "info";
            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $("#IMG4 img").css("display","none")
                    $("#IMG4 br").css("display","none")
                    $('#IMG4').append('<br/><img  src="'+ imgsrc +'" />');

                });

            });

        }
        //开始上传文件
        // uploader.start();
    });



    uploader.bind('BeforeUpload',function(up, file) {
        check_object_radio();
        set_upload_param(up, file.name, true);
    })

    uploader.bind('FileUploaded', function(up, file, info) {
        // console.log(file.name)
        if (info.status == 200)
        {
            imgUrl = get_uploaded_object_name(file.name) || "";


            console.log(imgUrl);
            // console.log(temp);
            if(temp == "skin"){
                imgObj.skin = imgUrl;
            }else if(temp == "face"){
                imgObj.face = imgUrl;

            }else if(temp == "live"){
                imgObj.live = imgUrl;

            }else if(temp == "info"){
                imgObj.info = imgUrl;
            }else if(temp == "video"){
                imgObj.video = imgUrl;
            }else if(temp == "roll"){
                imgObj.roll.push(imgUrl)

            }
            console.log(imgObj)
            if(imgObj.video && isSuccess == 1){

                    $('#IMG8').append('<br/><span class="successs" style="color:#cc3d3d">您已上传视频成功，请继续下一步</span>');
                    $('#IMG81').append('<br/><span class="successs" style="color:#cc3d3d">您已上传视频成功，请继续下一步</span>');

                    $(".wait").css("display","none");
                    $(".success").css("display","none");
                    $(".ing").css("display","none");
                    isSuccess = 0;

            }
            // if(imgArr.length == 4){
            //     $('#IMG8').append('<br/><span>您已上传视频成功，请继续下一步</span>');d
            // }


            // $("#img1").attr("src","http://arpt-user.oss-cn-shenzhen.aliyuncs.com/"+imgUrl).css("display","block");
            // $("#img11").attr("src","http://arpt-user.oss-cn-shenzhen.aliyuncs.com/"+imgUrl).css("display","block");

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
    });
})

//预览图片
function previewImage(file,callback){//file为plupload事件监听函数参数中的file对象,callback为预览图片准备完成的回调函数
    if(!file || !/image\//.test(file.type)) return;
        if(file.type=='image/gif'){//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
            var fr = new mOxie.FileReader();
            fr.onload = function(){
                callback(fr.result);
                fr.destroy();
                fr = null;
            }
            fr.readAsDataURL(file.getSource());
        }else{
            var preloader = new mOxie.Image();
            preloader.onload = function() {
                preloader.downsize( 300, 300 );//先压缩一下要预览的图片,宽300，高300
                var imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80):preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                callback && callback(imgsrc); //callback传入的参数为预览图片的url
                preloader.destroy();
                preloader = null;
            };
        preloader.load( file.getSource() );
    }
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
    console.log(data)
    if(typeof imgUrl == "undefined"){
        layer.confirm('参数不完整');
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
                    layer.confirm('添加成功');
                    window.location.reload();
                }else{
                    layer.confirm(data.err);
                }
            },
            error: function () {
            }
        });
    }else{
        layer.confirm("参数不完整");

        return;
    }
}

//添加广告机

$('#editPostfiles').click(function(){
    // if($('#IMG3').find('img').length){
    //     if($('#IMG4').find('img').length){
        // var roll = $("#IMG3").find('img').attr('src');
        // var info = imgArr.pop();
        var data = {
            "skin":imgObj.skin,
            "face":imgObj.face,
            "live":imgObj.live,
            "video":imgObj.video,
            "info": imgObj.info,
            "roll": imgObj.roll

        };
        console.log(data)
          $.ajax({
            type: "POST",
                url: serve + "/addArad",
                dataType: 'json',
                data: data,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (res) {
                    console.log(res)
                    layer.confirm("操作成功");

                    window.location.reload();


                },
                error: function () {
                }
        });


    // }else{
    //     alert("请选择公司信息照片")
    // }
    // }else{
    //     alert("请选择轮播图照片")
    // }
     })



    //修改广告机

$('#adPostfiles').click(function(){
    // if($('#IMG3').find('img').length){
    //     if($('#IMG4').find('img').length){
        // var roll = $("#IMG3").find('img').attr('src');
        // var info = imgArr.pop();
        var data = {
            "skin":imgObj.skin || "",
            "face":imgObj.face || "",
            "live":imgObj.live || "",
            "video":imgObj.video || "",
            "info": imgObj.info || "",
            "roll": imgObj.roll || ""

        };
        console.log(data)
          $.ajax({
            type: "POST",
                url: serve + "/editAdar",
                dataType: 'json',
                data: data,
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (res) {
                    console.log(res)
                    layer.confirm("操作成功");

                    window.location.reload();


                },
                error: function () {
                }
        });


    // }else{
    //     alert("请选择公司信息照片")
    // }
    // }else{
    //     alert("请选择轮播图照片")
    // }
     })
//加载时请求广告机信息
function getAr(){
    $.ajax({
            type: "GET",
                url: serve + "/getAdar",
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                success: function (res) {
                    localStorage.setItem("editArInfo",JSON.stringify(res.results));
                    //加载编辑的ar广告信息
                    //修改按钮文字
                    if(res.code == 1){
                        isArad = 1;
                        $('.arTop').append('<img src='+res.results.live+'>');
                    // $('.arMiddle').append('<img src="../arpt-boss/imgs/top.png">')
                    var result = res.results;
                    var str = "";
                    for(var i = 0; i < res.results.roll.length;i++){
                            str += '<img data-caption="" src='+res.results.roll[i]+'>'
                    }


                    // console.log(str1);
                    // $("#slidy").css("width","800%");
                    $("#slidy").append(str);

                    $('.arBottom').append('<img src='+res.results.info+'>');
                    $('#video').attr('src',res.results.video);

                    localStorage.setItem("skin",res.results.skin);
                    localStorage.setItem("face",res.results.face);
                    localStorage.setItem("live",res.results.live);
                    }
                    
                },
                error: function () {
                }
        });
}

// // 打开添加广告机时清空里面的内容
// $('#adClick').on('click',function(){
//     $("#IMG3").children().remove();
//     // document.getElementById('ossfile').innerHTML = '';
// })

//模态框启动事件
function upmodel(){
    // console.log($(this))
    $("#click1").trigger("click");
}


//删除广告
function removeAd(){
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
                    layer.confirm("删除成功");
                    window.location.reload();
                }else{
                    layer.confirm("删除失败");

                }
            }
        })
    })
}


//编辑web广告
function editAd(){
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
        for(var i = 0;i < $("#type1 option").length;i++){
          if($($("#type1 option")[i])[0].text == toolTypes){
              $($("#type1 option")[i])[0].selected = true;
          }
        }

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
                // let imgUrl = imgs.split("http://arpt-user.oss-cn-shenzhen.aliyuncs.com/")[1];
                var adUrl = $("#link1").val();
                var toolType = $('#type1 option:selected').val();
                var editionType = $('#tool1 option:selected').val();
                var adName = $('#names1').val();
                // console.log(imgUrl)
                // console.log("修改后"+adUrl,toolType,editionType,adName,imgUrl,id);
                if(adUrl && toolType && editionType && adName){
                    $.ajax({
                        type: "POST",
                        url: serve + "/editAdvertisement",
                        dataType: 'json',
                        data: {
                            "imgUrl": imgs.split("http://arpt-user.oss-cn-shenzhen.aliyuncs.com/")[1],
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
                                layer.confirm("修改成功");

                                window.location.reload();
                            }
                        },
                        error: function () {
                        }
                    });
                }else{
                    layer.confirm("参数不完整");

                    return;
                }
            }else{
                var adUrl = $("#link1").val();
                var toolType = $('#type1 option:selected').val();
                var editionType = $('#tool1 option:selected').val();
                var adName = $('#names1').val();
                console.log(imgUrl)
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
                                layer.confirm("修改成功");
                                window.location.reload();
                            }
                        },
                        error: function () {
                        }
                    });
                }else{
                    layer.confirm("参数不完整");

                    return;
                }
            }


        })
    })
}

//初始化web广告
function intWebAd(){
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
                        str += "</tr>"
                        if(msg.length){
                            isWebad = 1;
                        }
                    for(var i = 0;i < msg.length;i++){
                        str += "<tr>"
                            str += "<td class='toolType'>"+msg[i].toolType+"</td>"
                            str += "<td class='editionType'>"+msg[i].editionType+"</td>"
                            str += "<td class='adUrl'>"+msg[i].adUrl+"</td>"
                            str += "<td class='adName'>"+msg[i].adName+"</td>"
                            str += "<td><img class='img' src="+msg[i].imgUrl+"></td>"
                            str += "<td onclick='upmodel()' data-id="+msg[i]._id+" class='rew'><img class='pics' src=imgs/rewrite.jpg></td>"
                            str += "<td data-id="+msg[i]._id+" class='del'><img class='pics' src=imgs/delete.jpg></td>"
                        str += "</tr>"

                    }

                    str += "</tbody>";
                    // console.log($(str))
                    $("#insert").append(str);
                    // var inser = document.getElementById("insert");
                    // inser.innerHTML(str)
                    // console.log(inser);

                }
            },
            error: function () {
            }
        });
}

//编辑ar广告信息
function editAr(msg){
    $("#IMG5").append('<img style="width:25rem" src='+msg.skin+'>');
    $("#IMG6").append('<img style="width:25rem" src='+msg.face+'>');
    $("#IMG7").append('<img style="width:25rem" src='+msg.live+'>');
    var imagestr = "";
    for(var i = 0;i<msg.roll.length;i++){
        imagestr += '<img style="width:25rem"; class="imgnone" src='+msg.roll[i]+'><hr class="hrnone">'
    }
    $("#IMG3").append(imagestr);
    $("#IMG4").append('<img style="width:25rem" src='+msg.info+'>');
    $("#IMG8").append('<br/><span class="success">若要修改，请重新添加视频,否则不操作</span>');


}
window.onload = function(){
    if($(window).width() <750){
        layer.confirm('请在电脑上打开此页面！',function(index){
            //这里是你点击确认后，要执行的事件
            location.href="basic-message.html";
        });
    }
    if($(window).width() <376){
        $(".ar").css({"position":"static","width":"28rem","margin-left":"2rem"})
        $("video").css({"position":"static","width":"100%"})
        $("h1").css("display","none")
        $("#slidy-container").css({"width":"109.2%"})
        $(".container").css({"height":"100%"})
        $(".bgcolor-1").css({"height":"100%"})
        $("#slidy-container").css({"height":"100%"})
        $("#slidy").css({"height":"100%"})
        $("#mobile").css("display","block")
        $("#mobile .btn").css("margin-top","0")
        $("#pc").css("display","none")
        // console.log("手机")
        


    }
    removeAd();
    editAd();
    intWebAd();
    getAr();

    setTimeout(function(){
            if(isArad == 1){
                //有ar广告就让添加按钮隐藏
            $("#adClick").css("display","none")
            $(".nothing").css("display","none")
        }else{
                //没有ar广告就让预览隐藏
            $(".isblock").css("display","none")
            $("#editAr").css("display","none")
            $("#text").css("display","none")
        }
        if(isWebad == 0){
                //没有web广告就让表格头部隐藏
            $("#insert").css("display","none")
        }else{
            $(".nothing").css("display","none")
                }
        if(isArad == 0&& isWebad == 0){
            $("#container").append("<div class=nothing>请上传web版广告或者AR版广告</div>")
        }
    },600)

    $(".dropdown-menu").on("click","a",function(){
        console.log($(this).attr("data-type"));
        $("#text").html($(this).html());
        if($(this).attr("data-type") == "skin"){
            $.ajax({
            type: "POST",
             url: serve + "/setOptTool",
            //url: "http://10.0.0.143:4300/getProjectList",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data:{"tool":"skin"},
            crossDomain: true,
            success: function (res) {
                console.log(res)
            $('.arTop img').attr("src",localStorage.getItem("skin"))

            },
            error: function () {
            }
        });
        }else if($(this).attr("data-type") == "face"){
            $.ajax({
            type: "POST",
             url: serve + "/setOptTool",
            //url: "http://10.0.0.143:4300/getProjectList",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data:{"tool":"face"},
            crossDomain: true,
            success: function (res) {
                console.log(res)
            $('.arTop img').attr("src",localStorage.getItem("face"))

            },
            error: function () {
            }
        });

        }else if($(this).attr("data-type") == "live"){
            $.ajax({
            type: "POST",
             url: serve + "/setOptTool",
            //url: "http://10.0.0.143:4300/getProjectList",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data:{"tool":"face"},
            crossDomain: true,
            success: function (res) {
                console.log(res)
            $('.arTop img').attr("src",localStorage.getItem("live"))

            },
            error: function () {
            }
        });

        }else if($(this).attr("data-type") == "video"){
            $.ajax({
            type: "POST",
             url: serve + "/setOptTool",
            //url: "http://10.0.0.143:4300/getProjectList",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data:{"tool":"video"},
            crossDomain: true,
            success: function (res) {
                console.log(res)
            },
            error: function () {
            }
        });

        }
    })

     document.getElementById("editAr").addEventListener("click", function(){
    $("#IMG5 img").css("display","none");
    $("#IMG6 img").css("display","none");
    $("#IMG7 img").css("display","none");
    $("#IMG3 img").css("display","none");
    $("#IMG3 hr").css("display","none");
    $("#IMG4 img").css("display","none");
    $("#IMG8 span").css("display","none");
    $("#IMG8 br").css("display","none");
    editAr(JSON.parse(localStorage.getItem("editArInfo")))

});



}


