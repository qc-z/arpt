/**
 * Created by Wonderchief on 2017/2/23.
 */
var fd={
  //uuid:localStorage.getItem("wxarpt-og-uuid"),myuuid:"0"
  //myuuid:localStorage.getItem("wxarpt-my-uuid")
};
/ 获取url,因为下面的clientId需要从url中拿，所以要写在声明前面
function UrlSearch(){
    var name,value;
    var str=location.href; //取得整个地址栏
    var num=str.indexOf("?")
    str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
    var arr=str.split("&"); //各个参数放到数组里
    for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
         }
    }
}
var Request=new UrlSearch(); //实例化
var myClientId = Request.clientId;
//console.log(fd);
// 初始化Web Uploader
    var uploader = WebUploader.create({

        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径
        swf: 'js/Uploader.swf',

        // 文件接收服务端。
        server: 'http://106.75.64.209:8082/lookTest',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '.filePicker',

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            //mimeTypes: 'image/*,text/plain,application/msword,application/octet-stream,application/vnd.ms-excel,application/x-shockwave-flash'
        },
        formData:{
            data: JSON.stringify({
                uuid: localStorage.getItem("wxarpt-my-uuid")||'',
                mobile: '',
                clientId: myClientId
            })
        }
    });
// 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {

    });
// 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        $('.loading1').slideDown();
        $('.rao').css({animation: 'rao 4s linear infinite' })
    });

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ,response) {

        console.log(response);
        if(response.status==="fail")
        {
            alert("error:"+response.err);
            return;
        }
        //存储在客户端

        localStorage.setItem("testdata",JSON.stringify(response));
        localStorage.setItem("wxarpt-my-uuid",response.uuid);
        localStorage.setItem("wxarpt-my-clientid",response.clientId);

        if(response.isHaveMobile)
        {}
        if(false)
        {
            //location.href="simplify.html?uuid="+response.uuid;
            //location.href = "report.html?uuid="+response.uuid;

        }
        else {
            location.href = "last-step2.html";
        }
        //这里是测试结果，应该存储到某个地方，等用户手机验证完成后即可渲染到页面上
        //注意response.uuid:用户的UUID，到时候要和手机号和验证码一起发送到后台
    });

// 文件上传失败，显示上传出错。
    uploader.on( 'uploadError', function( file ) {
        alert('上传失败');

    });

// 完成上传完了，成功或者失败，先删除进度条。
    uploader.on( 'uploadComplete', function( file ) {
        console.log(file.id);
        $('.loading1').slideUp();
    });
