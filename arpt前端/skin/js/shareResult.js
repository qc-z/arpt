window.onload = function() {
    $('#img').attr('src', localStorage.getItem('pic'));

    var c = document.getElementById("canvas_oil1");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.arc(50, 50, 45, -0.5 * Math.PI, 1.5 * Math.PI);
    ctx.stroke();

    var d = document.getElementById("canvas_oil2");
    var dtx = d.getContext("2d");
    dtx.beginPath();
    dtx.strokeStyle = 'rgb(238,48,119)';
    dtx.lineWidth = 5;
    // dtx.arc(50, 50, 45, -0.5 * Math.PI, 0.25 * Math.PI);
    // dtx.stroke();

    var e = document.getElementById("canvas_water1");
    var etx = e.getContext("2d");
    etx.beginPath();
    etx.strokeStyle = 'red';
    etx.lineWidth = 5;
    etx.arc(50, 50, 45, -0.5 * Math.PI, 1.5 * Math.PI);
    etx.stroke();

    var f = document.getElementById("canvas_water2");
    var ftx = f.getContext("2d");
    ftx.beginPath();
    ftx.strokeStyle = 'rgb(238,48,119)';
    ftx.lineWidth = 5;
    // ftx.arc(50, 50, 45, -0.5 * Math.PI, 0.25 * Math.PI);
    // ftx.stroke();

    ShowMap("map", {
        city: '广州市',
        addr: '广东省广州市越秀区先烈中路80号汇华商贸大厦2313室',
        title: '',
        lawfirm: '广州聆歌信息科技公司',
        tel: '',
        pic: '',
        ismove: '0'
    });

    function show() {
        var result = JSON.parse(localStorage.getItem('result'));
        var color_level = result.color_level;
        var inflammation_level = result.inflammation_level;
        var inflammation = result.inflammation;
        var smoothy = result.smoothy;
        var smoothy_level = result.smoothy_level;
        var prose = result.prose;
        var oil_level = result.oil_level;

        if (result.skintype == '干性皮肤') {
            $('#skin_dry').removeClass('total_skin_unselect').addClass('total_skin_select');
        } else if (result.skintype == '混合性皮肤') {
            $('#skin_mix').removeClass('total_skin_unselect').addClass('total_skin_select');
        } else {
            $('#skin_oil').removeClass('total_skin_unselect').addClass('total_skin_select');
        }

        // 判断炎症严重程度
        if (result.INFLAMMATION_FLAG == '较轻') {
            $('#pimple_text_low').addClass('pimple_text_selected');
        } else if (result.INFLAMMATION_FLAG == '中等') {
            $('#pimple_text_mid').addClass('pimple_text_selected');
        } else if (result.INFLAMMATION_FLAG == '重') {
            $('#pimple_text_mid').addClass('pimple_text_selected');
        } else if (result.INFLAMMATION_FLAG == '严重') {
            $('#pimple_text_hig').addClass('pimple_text_selected');
        } else {
            $('#pimple_text_hig').addClass('pimple_text_selected');
        }

        var ele = $('.smooth_symbol_level1');
        for (var i = 0; i < smoothy_level; i++) {
            $(ele[i]).removeClass('smooth_symbol_level1').addClass('smooth_symbol_level2');
        }

        // 移动皮肤颜色游标
        $('#color_level').css({ 'position': 'relative', 'left': color_level * 0.7 + 1.3 + 'rem' }).text(color_level + 1 + '级');

        // 画出油份水分图形及显示数字
        $('#oil_point').text(result.OIL_FLAG);
        dtx.arc(50, 50, 45, -0.5 * Math.PI, (result.OIL_FLAG * 2 / 100 - 0.5) * Math.PI);
        dtx.stroke();
        $('#water_point').text(result.WATER_FLAG);
        ftx.arc(50, 50, 45, -0.5 * Math.PI, (result.WATER_FLAG * 2 / 100 - 0.5) * Math.PI);
        ftx.stroke();

        // 移动炎症游标
        $('#pimple_symbol').css({ 'left': inflammation_level + 'rem' });
        $('#pimple_level').css({ 'width': inflammation_level + 0.25 + 'rem' });


        $('#skin_symbol').text(oil_level + '级').css({ 'left': oil_level * 6 / 8 + 1.5 + 'rem' });
        $('#skin_level').css({ 'width': oil_level * 6 / 8 + 'rem' });

        $('#result_button').click(function(e) {
            location.href = "index.html";
        });

        $('#skin_skin').text(result.skintype);
        $('#problem_value').text("毛孔"+result.PROSE_FLAG);

        console.log(result);
    }
    show();
}


console.log(location);