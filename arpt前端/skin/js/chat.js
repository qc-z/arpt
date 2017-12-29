 //1，  建立连接： var clientUSER = io.connect('http:// 10.0.0.116:3000/[clientId]');
 //2，  clientUSER.on(‘connect’, function(){clientUSER.emit(‘USERE’)});
 //3，  接受AR消息 clientUSER.on(‘client news’,  function(){mobile: 135xxx,  location:[location],  date:[时间戳], msg:[msg:msg], photo:[base64]} )
 //4，  发送用户消息 clientUSER.emit(‘user news’,   date:[date.now()], msg:msg, photo:[base64])
 //5，  下线：clientUSER.on(‘disconnect’)
 //connection to host and port
 //格式化时间
 var chararr = [];
 var picShade = null;
 var format = function(time, format) {
     var t = new Date(time);
     var tf = function(i) {
         return (i < 10 ? '0' : '') + i
     };
     return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
         switch (a) {
             case 'yyyy':
                 return tf(t.getFullYear());
                 break;
             case 'MM':
                 return tf(t.getMonth() + 1);
                 break;
             case 'mm':
                 return tf(t.getMinutes());
                 break;
             case 'dd':
                 return tf(t.getDate());
                 break;
             case 'HH':
                 return tf(t.getHours());
                 break;
             case 'ss':
                 return tf(t.getSeconds());
                 break;
         };
     });
 };
 var uploader = WebUploader.create({
     // 选完文件后，是否自动上传。
     auto: true,
     // swf文件路径
     swf: '../css/Uploader.swf',
     // 文件接收服务端。
     server: 'http://wxarpt.pjnice.com:8081/user',
     // 选择文件的按钮。可选。
     // 内部根据当前运行是创建，可能是input元素，也可能是flash.
     pick: '#upload_input',
     formData: {
         data: JSON.stringify({
             "uuid": localStorage.getItem('wxarpt-my-uuid') || "",
             "to": localStorage.getItem('wxarpt-my-clientid'),
             "mobile": localStorage.getItem('mobile') || "",
             "location": localStorage.getItem('myAddress'),
             "type": myType,
             "date": date,
         })
     },
     // 只允许选择图片文件。
     accept: {
         title: 'Images',
         extensions: 'gif,jpg,jpeg,bmp,png',
         mimeTypes: 'image/*'
     },
     method: 'POST'
 });
 // 当有文件添加进来的时候
 uploader.on('fileQueued', function(file) { // webuploader事件.当选择文件后，文件被加载到文件队列中，触发该事件。等效于 uploader.onFileueued = function(file){...} ，类似js的事件定义。
     // 创建缩略图
     // 如果为非图片文件，可以不用调用此方法。
     // uploader.makeThumb(file, function(error, src) { //webuploader方法
     //     if (error) {
     //         alert('不能预览');
     //         return;
     //     }
     //     localStorage.setItem('pic', src);
     //     $('#imgs').attr('src', src);
     // }, 400, 400);
 });
 // 文件上传过程中创建进度条实时显示。
 uploader.on('uploadProgress', function(file, percentage) {});
 // 文件上传成功，给item添加成功class, 用样式标记上传成功。
 uploader.on('uploadSuccess', function(file, res) {
     var userinfo = null;
     if (res.code == 1) {
         userinfo = {
             // to:[clientId],
             // type:[look/skin],
             // mobile: 135xxx,
             // location:[location],
             // date:[时间],
             // msg:[msg:msg],
             // photo:[base64]}
             uuid: localStorage.getItem("wxarpt-my-uuid"),
             to: localStorage.getItem('wxarpt-my-clientid'),
             type: myType,
             mobile: localStorage.getItem("mobile"),
             location: localStorage.getItem('myAddress'),
             date: date,
             photo: res.url,
             msg: ''
         };
         clientUSER.emit("user news", userinfo);
         addselfinfo(userinfo, callBack);
     }

 });
 // 文件上传失败，显示上传出错。
 uploader.on('uploadError', function(file) {
     alert('发送失败,请重试！');
 });
 // 完成上传完了，成功或者失败，先删除进度条。
 uploader.on('uploadComplete', function(file) {});

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
 var myType = Request.type; // 从地址栏获取类型
 //全局photo
 // var photo = "";
 var d = new Date();
 var date = format(d.getTime(), 'yyyy-MM-dd HH:mm:ss');
 var clientUSER = io.connect('http://wxarpt.pjnice.com:8081', {'reconnection': true, 'forceNew': true});
 var clientId = localStorage.getItem("wxarpt-my-clientid");
 // //用户上线
 // // clientUSER.on('connect', function(){
 // //     var obj = {
 // //         uuid:localStorage.getItem("wxarpt-my-uuid"),
 // //         to:clientId,
 // //         type:myType,
 // //         mobile: localStorage.getItem("mobile"),
 // //         location:"广州越秀",
 // //         date:date
 // //         // uuid:[uuid],
 // //         // to:clientId,
 // //         // type:[look/skin],
 // //         // mobile: 135xxx,
 // //         // location:[location],
 // //         // date:[时间]
 // //     }
 // //     clientUSER.emit('USER',obj)
 // // });
 var obj = {
     uuid: localStorage.getItem("wxarpt-my-uuid"),
     to: clientId,
     type: 'look',
     mobile: localStorage.getItem("mobile"),
     location: localStorage.getItem('myAddress'),
     date: date,
     // uuid:[uuid],
     // to:clientId,
     // type:[look/skin],
     // mobile: 135xxx,
     // location:[location],
     // date:[时间]
 }
 clientUSER.emit('USER', obj)
 var callBack = function() {
         // 查看缩略图
         $('.photo').unbind('click').click(function(e) {
             console.log($(e.target).attr('src'))
             picShade = '<div class="picShade"><img src="' + $(e.target).attr('src') + '" alt=""></div>';
             $('body').append($(picShade));

             $('.picShade').unbind('click').click(function() {
                 $('.picShade').remove();
             })
         })
     }
     //用户下线
 clientUSER.on('disconnect', function() {
     console.log('bye!');
     // windows.location.reload()
 })

clientUSER.on('reconnect', function() {
     console.log('bye!');
     // windows.location.reload()
      clientUSER.emit('USER', obj)
 })

 //点击发送事件
 function sendMess() {
     //判断输入框是否为空
     if (!$("#msg").val()) {
         return
     }
     var msg = $("#msg").val();
     //文字和图片只能存在一个
     // if (msg !== "") {
     //     photo = "";
     // }
     var userinfo = {
         // to:[clientId],
         // type:[look/skin],
         // mobile: 135xxx,
         // location:[location],
         // date:[时间],
         // msg:[msg:msg],
         // photo:[base64]}
         uuid: localStorage.getItem("wxarpt-my-uuid"),
         to: clientId,
         type: myType,
         mobile: localStorage.getItem("mobile"),
         location: localStorage.getItem('myAddress'),
         date: date,
         photo: '',
         msg: msg
     };
     console.log(userinfo)
     clientUSER.emit("user news", userinfo);
     //用户消息拼写
     addselfinfo(userinfo, callBack);
     //清空输入框
     $("#msg").val("");
     msg = '';
     //清空文件选择框
     // s_input.value = '';
     // photo = '';
     $('.s_body').scrollTop($('.s_body')[0].scrollHeight);
 }
 $('#chat_btn').click(sendMess);

 //接受后台信息
 clientUSER.on('client news', function(clientMsg) {
     console.log(clientMsg)
         //管理员消息拼写
     addClinetinfo(clientMsg, callBack);
     // to:[uuid],
     // mobile: 135xxx,
     // type:[look/skin],
     // location:[location],
     // date:[时间],
     // msg:[msg:msg]
     // photo:[base64]}
 })

 //拼接用户字符串
 function addselfinfo(selfMsg, cb) {
     var str = "";
     str += '<div class="s_body_context">';
     str += '<span class="s_body_context_time">' + selfMsg.date + '</span>';
     str += '<div class="s_body_context_detail1">';
     str += '<img src="static/im/im_07.jpg" />';
     str += '<img src="static/im/im_15.png" />';
     if (selfMsg.photo == "") {
         str += '<span class="msg">' + selfMsg.msg + '</span>';
     } else {
         str += '<img class="photo" src=' + selfMsg.photo + ' />';
     }
     str += 'div';
     str += 'div';
     var msgHtml = $(str);
     msgHtml.appendTo('.s_body');
     if (!!cb) cb();
 }

 //拼接管理员字符串
 function addClinetinfo(clientMsg, cb) {
     console.log(clientMsg)
     var str = "";
     str += '<div class="s_body_context">';
     str += '<span class="s_body_context_time">' + clientMsg.date + '</span>';
     str += '<div class="s_body_context_detail2">';
     str += '<img src="static/im/im_11.png" />';
     str += '<img src="static/im/im_19.png" />';
     if (!clientMsg.photo) {
         str += '<span class="msg">' + clientMsg.msg + '</span>';
     } else {
         str += '<img class="photo right" src=' + clientMsg.photo + ' />';
     }
     str += 'div';
     str += 'div';
     var msgHtml = $(str);
     // console.log(msgHtml);
     msgHtml.appendTo('.s_body');
     if (!!cb) cb();
 }
 // // //上传文件事件
 // // var s_input = document.getElementById('s_input');
 // // s_input.addEventListener('change', showBase64, false);

 // // //转base64
 // // function showBase64() {
 // //     var file = this.files[0];
 // //     var reader = new FileReader();
 // //     reader.readAsDataURL(file);
 // //     reader.onload = function() {
 // //         photo = this.result;
 // //         sendMess();
 // //     }
 // // }

 $('#back_btn').click(function() {
     clientUSER.emit('USER OFF', {
         uuid: localStorage.getItem("wxarpt-my-uuid"),
         clientId: localStorage.getItem("wxarpt-my-clientId"),
     })
     history.go(-1);
 })

 $('#upload_input').click(function(e) {
     $('.webuploader-element-invisible')[0].click();
 })
