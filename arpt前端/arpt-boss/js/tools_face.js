/**
 * Created by Administrator on 2017/5/16.
 */

    /*var base_info = JSON.parse(localStorage.getItem('base_info'));
    var face_info = base_info.faceRole;
    var qr = base_info.shareFaceUrl || 'https://www.baidu.com/s?wd=for+in+%E5%BE%AA%E7%8E%AF&rsv_spt=1&rsv_iqid=0xddb3c21b0000689b&issp' +
        '=1&f=3&rsv_bp=0&rsv_idx=2&ie=utf-8&rqlang=&tn=baiduhome_pg&rsv_enter=1&inputT=6199';
    console.log(base_info);
    if (face_info.role) {
        $('#s_title_status').text('已开通');
        $('#s_title_btn').hide();
    } else {
        $('#s_title_status').text('未开通');
    }
    $('#s_a').attr('href', qr);
    $('#s_url_url').text(qr);
    $('#s_qrCode').qrcode(qr);
    $('#s_copy').click(function (e) {
        var sam = document.getElementById('s_url_url').innerText;
        copyToClipboard(sam);
    });*/
    // 获取链接地址
    function getURL(type){
        var base_info = JSON.parse(localStorage.getItem('base_info'));
        console.log(base_info);
        // debugger;
        if( type == 'face' ){
            var info = base_info.faceRole;
            var qr = base_info.shareFaceUrl || 'http://www.legle.cc/';
        }else if( type=='skin' ){
            var info = base_info.skinRole;
            var qr = base_info.shareSkinUrl || 'http://www.legle.cc/';
        }else{
            var info = base_info.starRole;

            console.log(base_info.shareStarUrl)
            var qr = base_info.shareStarUrl || 'http://www.legle.cc/';
        }

        if (info.role) {
            $('#s_title_status').text('已开通');
            $('#s_title_btn').hide();
        } else {
            $('#s_title_status').text('未开通');
        }


        if(qr.indexOf('www.legle.cc') == -1){
            $('#s_a').attr('href', qr + '&model=1');
            $('#s_url_url').text(qr + '&model=1');
        }else{
            $('#s_a').attr('href', qr + '?model=1');
            $('#s_url_url').text(qr + '?model=1');
        }
        showQRCode(qr+"&model=1");

        // 根据选择的模板生成对应的链接
        $("#getModel").change(function(){
            var model = $("#getModel").val();
            console.log(111111)
            if(qr.indexOf('www.legle.cc') == -1){
                $('#s_a').attr('href', qr + '&model=' + model);
                $('#s_url_url').text(qr + '&model=' + model);
                var qrCode = qr + '&model=' + model;
                showQRCode(qrCode);
            }else{
                $('#s_a').attr('href', qr + '?model=' + model);
                $('#s_url_url').text(qr + '?model=' + model);
                var qrCode = qr + '&model=' + model
                showQRCode(qrCode);
            }

        })
    }

    //init
    var clipboard = new Clipboard('#s_copy');
    //优雅降级:safari 版本号>=10,提示复制成功;否则提示需在文字选中后，手动选择“拷贝”进行复制
    clipboard.on('success', function(e) {
        alert('复制成功!')
        e.clearSelection();
    });
    clipboard.on('error', function(e) {
        alert('请选择“拷贝”进行复制!')
    });

    function showQRCode(qr){
        $('#s_qrCode').html('');
        console.log(qr);
        //qrcode用canvas生成的二维码，在微信中长按识别不了，所以需要处理
        $('#s_qrCode').qrcode(qr);
        //从 canvas 提取图片 image
        function convertCanvasToImage(canvas) {
            //新Image对象，可以理解为DOM
            var image = new Image();
            // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
            // 指定格式 PNG
            image.src = canvas.toDataURL("image/png");
            return image;
        }

        //获取网页中的canvas对象
        var mycanvas1=document.getElementsByTagName('canvas')[0];

        //将转换后的img标签插入到html中
        var img=convertCanvasToImage(mycanvas1);

        //imagQrDiv表示你要插入的容器id
         $('#s_qrCode').append(img);
    }

