/**
 * Created by Administrator on 2017/2/16.
 */
$(function() {
    ;(function () {

        $('.p-title').click(function () {
            if ($(this).children('.add').html() == '+') {
                $(this).siblings('.hidden').slideDown()
                $(this).children('.add').html('-')
            } else {
                $(this).siblings('.hidden').slideUp()
                $(this).children('.add').html('+')
            }

        })

    })();

/*    ;(function () {


        var num= 0;
        timer = setInterval(function () {
            num += 0.1
            if (num < 94.45) {
                $('.point').html(num)
            } else {
                clearInterval(timer)
            }

        }, 10)
        console.log(num)

    })();*/



















});