/**
 * Created by Wonderchief on 2017/2/23.
 */

/*;(function(){
    var fd={
        uuid:localStorage.getItem("wxarpt-og-uuid")
    };
    console.log(fd)
// 初始化Web Uploader
    var uploader = WebUploader.create({

        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径
        swf: 'js/Uploader.swf',

        // 文件接收服务端。
        server: '../arpt-boss/upload',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker1',

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/!*'
        },
        //formData:fd
    });
// 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {

    });
// 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {

    });

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ,response) {

        console.log(response);
        $(xxx).attr(src,'/upload/'+response.filename)
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
    });
})();

;(function(){
    var fd={
        uuid:localStorage.getItem("wxarpt-og-uuid")
    };
    console.log(fd)
// 初始化Web Uploader
    var uploader = WebUploader.create({

        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径
        swf: 'js/Uploader.swf',

        // 文件接收服务端。
        server: '../arpt-boss/upload',

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#filePicker2',

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/!*'
        },
        //formData:fd
    });
// 当有文件添加进来的时候
    uploader.on( 'fileQueued', function( file ) {

    });
// 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {

    });

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file ,response) {

        console.log(response);
        $(xxx).attr(src,'/upload/'+response.filename);
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
    });
})();*/









