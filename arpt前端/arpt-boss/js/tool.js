/**
 * Created by Administrator on 2017/5/16.
 */
$(document).ready(function () {
    var serve_div = $('#s_services');
    var base_info = JSON.parse(localStorage.getItem('base_info'));
    var serves = [base_info.faceRole, base_info.skinRole, base_info.starRole];

    serves.forEach(function (x, y) {
        console.log(x);
        var serve_name = '';
        var serve_date = '';
        var my_serve = '';

        if (x.role) {
            serve_date = x.from.split('T')[0] + '至' + x.to.split('T')[0];
        } else {
            return false
            serve_date = '未开通';
        }
        if (y === 0) {
            serve_name = '颜值测试使用期限';
        } else if (y === 1) {
            serve_name = '皮肤测试使用期限';
        } else if (y === 2) {
            serve_name = '明星面对面使用期限';
        }
        my_serve = '<div class="row s_service">' +
            '<span class="col-xs-5">' + serve_name + '</span>' +
            '<span class="col-xs-7">' + serve_date + '</span>' +
            '</div>';
        serve_div.append($(my_serve));
    })
});