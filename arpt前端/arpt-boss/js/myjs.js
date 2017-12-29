var serve = 'http://test.legle.cc';
// var serve = 'http://arpt.leglear.com:82';
// var serve = 'http://106.75.64.209:8082';

$(function () {
    //导航栏
    $('.navbar-toggle').click(function () {
        $('.navbar-inverse .navbar-collapse, .navbar-inverse .navbar-form').hide();
        $('.nav-show').show(0).removeClass('animated bounceOutRight').addClass('animated bounceInRight')
    });
    $('.nav-shadow').click(function () {
        $('.nav-show').removeClass('animated bounceInRight').addClass('animated bounceOutRight').delay(1000).hide(0);
    })
});

$('.s_signout').click(function (e) {
    layer.confirm('确认退出吗？', {
        btn: ['确认', '取消'] //按钮
    }, function () {
        $.ajax({
            type: "POST",
            url: serve + "/clientSignOut",
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function (res) {
                console.log(res);
                if (res.code == 1 && res.err == 'ok') {
                    layer.msg('成功退出', {icon: 1});
                    location.href = 'login.html';
                }
            }
        })
    }, function () {
    });
});







