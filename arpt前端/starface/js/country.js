/**
 * Created by David on 2017/4/11.
 * 版权所有：广州聆歌信息科技有限公司
 * Legle co,.ltd.
 */
var obj = {
    // url: 'http://arpt.leglear.com:82'
    url: HOSTNAME
    , listdata: {}
    , search: {}
}

// ========分页=============//
function pages() {
    this.offset = 0;
    this.limit = 15;
    this.count = 100;
}

pages.prototype.getOffset = function () {
    return this.offset;
}
pages.prototype.setOffset = function (number) {
    this.offset = number;
}

pages.prototype.getLimit = function () {
    return this.limit;
}
pages.prototype.setLimit = function (number) {
    this.limit = number;
}

pages.prototype.setCount = function (number) {
    this.count = number;
}
pages.prototype.getCount = function () {
    return this.count;
}

pages.prototype.renew = function () {
    this.offset = 0;
    this.limit = 15;
}
var pages = new pages();


function addModal() {
    $("#addModal #name").val(null);

    $('#addModal').modal('show');
}

function addSubmit() {
    var data = {
        name: $('#name').val(),
        sex: $('#sex').val()
    }

    if (!data.name) {
        $.alert('缺少参数');
    } else {
        console.log(data)
        $.post(obj.url+'/creatFaceSet', data, function (result) {
            console.log(result)
            //console.log(res)
            if (result.code == 1) {

                $('#addModal').modal('hide');
                $.alert('添加成功!')
                refresh();
            }
        });
    }
}

// =============表格操作============== //
window.operateEvents = {
    'click #delete': function (e, value, facesets, index) {
        $.confirm({
            title: '警告',
            content: '此次删除无法恢复',
            buttons: {
                "确定": function () {
                    console.log(facesets)
                    $.get(obj.url + '/delFaceSet?faceSetID='+facesets._id, function (result) {
                        console.log(result)
                        if (result.code == 1) {
                            $.alert('删除成功!');
                            refresh();
                            return true;
                        }
                    })
                },
                "取消": function () {

                },
            }
        });
    }
}


// =============表格操作样式格式化============== //
function operateFormatter(value, row, index) {
    return [
        "<i id='delete' class='fa fa-remove fa-lg' style='padding: 0 5px 0 5px;' title='删除'></i>",
    ].join('');
}

//获取产品列表
function list() {
    //加载显示数据
    var data = {offset: pages.getOffset(), limit: pages.getLimit()};
    $.get(obj.url + "/faceSetList?data" , function (result) {
       /* pages.setCount(result.result.count);
        footer();*/
        // 判断返回数据中的性别
        for (var i = 0; i < result.facesets.length; i++) {
            if(result.facesets[i].sex==0){
                result.facesets[i].sex = '女';
            }else{
                result.facesets[i].sex = '男'
            }
        }

        $('.panel-heading #line').change(function () {
            getStation($(this).children('option:selected').val());
        })

        $('#tables').bootstrapTable({
            classes: 'table table-hover',
            striped: true, //是否显示行间隔色
            // showColumns: true,
            columns: [
                {
                    title: '编号',
                    align: "center",
                    valign: "middle",
                    field: "Faceset_no"
                },
                {
                    title: "名称",
                    field: "name",
                    detailView: true,
                    align: "center",
                    valign: "middle"
                },
                {
                    title: "性别",
                    field: "sex",
                    detailView: true,
                    align: "center",
                    valign: "middle"
                },
                {
                    field: 'operate',
                    title: '操作',
                    align: 'center',
                    valign: "middle",//垂直
                    events: operateEvents,
                    formatter: operateFormatter,
                }
            ],
            data: result.facesets
        });
    })
}

list();
//刷新列表
function refresh() {
    $.get(obj.url + "/faceSetList", function (result) {
        console.log(result)
        /*pages.setCount(result.result.count);
        footer();*/
        // 判断返回数据中的性别
        for (var i = 0; i < result.facesets.length; i++) {
            if(result.facesets[i].sex==0){
                result.facesets[i].sex = '女';
            }else{
                result.facesets[i].sex = '男'
            }
        }
        $('#tables').bootstrapTable('load', result.facesets);
    })
}

function footer() {
    if (pages.getCount() <= pages.getLimit()) {
        $(".panel-footer").hide();
    } else {
        totalPage();
        $(".panel-footer").show();
    }
}

//下一页
$(".panel-footer #nextPage").click(function () {

    $("#lastPage").attr('disabled', false);
    if (parseInt(pages.getOffset() + pages.getLimit() * 2) >= pages.getCount()) {
        $("#nextPage").attr('disabled', 'true');
        pages.setOffset(parseInt(pages.getLimit() + pages.getOffset()));
        refresh();
    } else {
        pages.setOffset(parseInt(pages.getLimit() + pages.getOffset()));
        refresh();
    }
    $("#pagination").text(parseInt($("#pagination").text()) + 1);
});

//上一页
$(".panel-footer #lastPage").click(function () {
    if (pages.getOffset() != 0) {
        pages.setOffset(parseInt(pages.getOffset() - pages.getLimit()));
        refresh();
        if (pages.getOffset() == 0) {
            $("#lastPage").attr('disabled', 'true');
        }
        $("#nextPage").attr('disabled', false);
        $("#pagination").text(parseInt($("#pagination").text()) - 1);
    }
});

//计算总页数
function totalPage() {
    var page = Math.ceil(pages.getCount() / pages.getLimit());
    $("#total_page").text(page)
}
