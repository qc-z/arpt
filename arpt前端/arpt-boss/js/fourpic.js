
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
var imgObj = {};


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

var ids = new Array("selectfiles");
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
        if($('#IMG').find('img').length>=1){
                    layer.msg("只能上传1张图片", {time: 1000});
                return false;
            }
        if(self.search('selectfiles')===0){ // 添加广告机轮播图，不限制数量
            plupload.each(files, function(file) {
                previewImage(file,function(imgsrc){
                    $('#IMG').append('<br/><img  src='+ imgsrc +' /><hr>');
                });
            });
        }
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
    var name = $("#product").val();
    var fistprice = $('#fistprice').val();
    var newprice = $('#newprice').val();
    var data = {
        "name": name,
        "fistprice": fistprice,
        "newprice": newprice,
        "imgUrl":imgUrl
    }
    console.log(data)
    if(name && fistprice && newprice && imgUrl){
        $.ajax({
            type: "POST",
            url: serve + "/addFourPic",
            dataType: 'json',
            data: data,
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                if(data.code == 1){
                    layer.msg("添加成功", {time: 1000},function(){
                        window.location.reload();

                    });

                }else{
                    layer.msg(data.err, {time: 1000});
                }
            },
            error: function () {
            }
        });
    }else{
        layer.msg("参数不完整", {time: 1000});

        return;
    }
}




//删除广告
function removeAd(){
    //删除广告
    $("#insert").on("click",".del",function(){
        id = $(this).attr("data-id");
        console.log(id)
        $.ajax({
            type: "GET",
             url: service + "deleteFourPic?toolId="+id,
            //url: "http://10.0.0.143:4300/getProjectList",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (res) {
                console.log(res)
                if(res.code == 1){
                    layer.msg("删除成功", {time: 1000},function(){
                        window.location.reload();
                    });
                }else{

                }
            }
        })
    })
}




//初始化web广告
function intWebAd(){
    $.ajax({
            type: "GET",
             url: serve + "/getFourPic",
            //url: "http://10.0.0.143:4300/getProjectList",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (res) {
                if(res.code == 1 && res.results.length !== 0){
                    var msg = res.results;
                    // console.log(msg);
                    var str = "";
                    str += "<tbody>"
                        str += "<tr>"
                            str += "<th>广告名称</th>"
                            str += "<th>原价格</th>"
                            str += "<th>折后价格</th>"
                            str += "<th>广告图片</th>"
                            str += "<th>删除</th>"
                        str += "</tr>"
                        
                    for(var i = 0;i < msg.length;i++){
                        str += "<tr>"
                            str += "<td class='adName'>"+msg[i].adName+"</td>"
                            str += "<td class='editionType'>"+msg[i].fistPrice+"</td>"
                            str += "<td class='adUrl'>"+msg[i].newPrice+"</td>"
                            str += "<td><img class='img' src="+msg[i].imgUrl+"></td>"
                            str += "<td data-id="+msg[i]._id+" class='del'><img class='pics' src=imgs/delete.jpg></td>"
                        str += "</tr>"

                    }

                    str += "</tbody>";
                    // console.log($(str))
                    $("#insert").append(str);
                    

                }
            },
            error: function () {
            }
        });
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
    }
    removeAd();
    intWebAd();

}

//模态框启动事件
function upmodel(){
    // console.log($(this))
    $("#click1").trigger("click");
}
