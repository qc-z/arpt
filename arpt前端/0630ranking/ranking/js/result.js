    /**
 * Created by Administrator on 2017/6/22.
 */
window.onload = function(){
var service = "http://test.legle.cc/";
	$.ajax({
            type: "GET",
            url: service + "/wxRedDetail",
            dataType: 'json',
            data: {"openid":GetQueryString("openid")},
            // data: {"openid":"oS_4zxCbRm6748gpoSDdlQE6QmHY"},
            // data: {"openid":"oS_4zxIrZ_UEhBSMyWCnBnvQy3p4"},

            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                console.log(data);
                if(data.ret == 1){
                	getList(data);
                }
                $('.text7').text(data.dateStart+" 至 "+data.dateEnd);
            },
            error: function () {
            }
        });

	//获取地址栏参数
	function GetQueryString(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}


	//拼接
	function getList(data){
		var msg = data.users;
		var onemsg = data.user;
		//第一名总数
		var firstshare = msg[0].shareNum;

		var topArr = ["15%","29%","43%","56%","68%","52%"]
	    var str = "";
	    var onestr = "";
	    for(var i = 0;i < msg.length;i++){
	        str += '<div class="person" style="top: '+topArr[i]+';">'
	        	str += '<div class="number">'+(i+1)+'</div>'
	            str += '<div class="photo">'
	            if(i == 0)
	            {
	            	str += '<img src="images/champion.png" alt="" class="headimg">'
	            }
	            	str += '<img src="'+msg[i].headimgurl+'" alt="">'

	            str += '</div>'
	            str += '<div class="line">'
	            	str += '<div class="names">'+msg[i].nickname+'</div>'
            if(firstshare == 0){
                var nn  = 0;
            }else{
                var nn = msg[i].shareNum / firstshare;
            }
	            	str += '<div class="colorLine" style=width:'+nn*100+'%></div>'
	            str += '</div>'
	        	str += '<div class="randNumber">'+msg[i].shareNum+'票</div>'
	        str += '</div>'

	    }

      onestr += '<div class="person" style="top: '+topArr[topArr.length-1]+';">'
      if(data.position < 10){
            var left = 0;
        }else if(data.position < 100 && data.position >= 10){
            var left = -4;
        }else if(data.position > 100){
            var left = -6;
        }
      	onestr += '<div class="number" style="position:absolute;left:'+left+'%;">'+data.position+'</div>'
          onestr += '<div class="photo" style="margin-right:1.7rem">'
          	onestr += '<img src="images/champion.png" alt="" class="headimg">'

          	onestr += '<img src="'+onemsg.headimgurl+'" alt="">'
          onestr += '</div>'
          onestr += '<div class="line">'
          	onestr += '<div class="names">'+onemsg.nickname+'</div>'

          	onestr += '<div class="colorLine" style=width:'+(onemsg.shareNum / firstshare)*100+'%></div>'
          onestr += '</div>'
      	onestr += '<div class="randNumber">'+onemsg.shareNum+'票</div>'
      onestr += '</div>'
console.log(onemsg.shareNum , firstshare)
	    // console.log(str)
	    $(".rand").prepend(str);

	    $(".getMoney").prepend(onestr);
        if(data.position > 10){
            $(".getMoney").css("background-image","url(../ranking/images/thanks.png)");
            $(".headimg").css("display","none");
        }


	}










}

