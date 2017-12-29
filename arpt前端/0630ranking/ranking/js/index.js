    /**
 * Created by Administrator on 2017/6/22.
 */
window.onload = function(){
var service = "http://test.legle.cc/";
//格式化时间
//当前时间
var dstar = getNowFormatDate();
$.ajax({
    type: "GET",
    url: service + "/wxRedDetail",
    dataType: 'json',
    data: {"openid":GetQueryString("openid")},
    // data: {"openid":"oS_4zxIrZ_UEhBSMyWCnBnvQy3p4"},
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true,
    success: function (data) {
        console.log(data);
        if(data.ret == 1){
        	getList(data);
        	dend = getEndFormatDate(data.dateEnd);
        	if($(".person")){
            setInterval(function(){
                dstar = getNowFormatDate()
                timer()
            },100);
        }
            // console.log(dstar,dend);
            if(new Date(dend).getTime() - new Date(dstar).getTime() <= 0){
                location.href = "result.html?openid="+GetQueryString('openid');
            }
            // console.log(new Date(dend).getTime() - new Date(dstar).getTime())
        }
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

	var topArr = ["15%","25%","35%","45%","55%","63%","66%","68%","75%","81%","84%","87%","90%"]
    var str = "";
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
        str += '<div class="text1" style="top: '+topArr[topArr.length-8]+';"></div>'
        str += '<div class="text2" style="top: '+topArr[topArr.length-7]+';"></div>'
        str += '<div class="text3" style="top: '+topArr[topArr.length-6]+';">您所在的排名是第<span class="position">'+data.position+'</span>位</div>'

        str += '<div class="person" style="top: '+topArr[topArr.length-5]+';">'

        if(data.position < 10){
            var left = 0;
        }else if(data.position < 100 && data.position >= 10){
            var left = -4;
        }else if(data.position > 100){
            var left = -6;
        }
        	str += '<div class="number" style="position:absolute;left:'+left+'%;">'+data.position+'</div>'
            str += '<div class="photo" style="margin-right:1.7rem">'
            	str += '<img src="'+onemsg.headimgurl+'" alt="">'
            str += '</div>'
            str += '<div class="line">'
            	str += '<div class="names">'+onemsg.nickname+'</div>'
            	str += '<div class="colorLine" style=width:'+(onemsg.shareNum / firstshare)*100+'%></div>'
            str += '</div>'
        	str += '<div class="randNumber">'+onemsg.shareNum+'票</div>'
        str += '</div>'
        str += '<div class="text4" style="top: '+topArr[topArr.length-4]+';"></div>'
        str += '<div class="text5" style="top: '+topArr[topArr.length-3]+';"></div>'
        str += '<div class="text6" style="top: '+topArr[topArr.length-2]+';">数据采集时间</div>'
        str += '<div class="text7" style="top: '+topArr[topArr.length-1]+';">'+data.dateStart+' 至 '+data.dateEnd+'</div>'
    // console.log(str)
    $(".rand").prepend(str);
}


//倒计时
function timer(){
// console.log(dstar,dend)
    formatDuring(dstar,dend);
    $(".days1").html(formatDuring(dstar,dend)[0])
    $(".days2").html(formatDuring(dstar,dend)[1])
    $(".hours1").html(formatDuring(dstar,dend)[2])
    $(".hours2").html(formatDuring(dstar,dend)[3])
    $(".mins1").html(formatDuring(dstar,dend)[4])
    $(".mins2").html(formatDuring(dstar,dend)[5])
}

// setTimeout(function(){
//         alert(formatDuring(dstar,dend))
//                 },1000);


function formatDuring(dateStart,dateEnd) {
    var mss = new Date(dateEnd).getTime() - new Date(dateStart).getTime()
    var strTime = [];
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (mss % (1000 * 60)) / 1000;
    if(days < 10){
        strTime.push(0,days);
    }else{
        strTime.push(days.toString()[0],days.toString()[1]);
    }
    if(hours < 10){
        strTime.push(0,hours);
    }else{
        strTime.push(hours.toString()[0],hours.toString()[1]);
    }
    if(minutes < 10){
        strTime.push(0,minutes);
    }else{
        strTime.push(minutes.toString()[0],minutes.toString()[1]);
    }
    return strTime;
}


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "/";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strSecond = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strSecond >= 0 && strSecond <= 9) {
        strSecond = "0" + strSecond;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}


function getEndFormatDate(date) {
    var end = date.split("-").join("/")
    return end;
}

}

