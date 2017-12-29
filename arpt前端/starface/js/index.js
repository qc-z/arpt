
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

function clearModal() {
    $("#addModal #name").val(null);
    $("#addModal #sex").val(null);
    $("#addModal #country").val(null);
    $("#addModal #introduction").val(null);
    $("#addModal #view").css("display", "none");
    $("#addModal #area").css("display", "none");
    $("#addModal #view").css("backgroundImage", '');
    $("#updateSubmit").hide();
    // $("#addSubmit").hide();
    $("#file").val("")
    $('#img_box').css('background-image','url(shangchuan.png)');
}
function addModal() {
    clearModal();
    // debugger
    $("#myModalLabe3").html("添加明星")
    $("#addSubmit").show();
    $('#addModal').modal('show');
    $('.sex').css('selected',"selected");

    var str = "";
    $('#country').html(""); 
    // $("#country").remove(".country");
    var countryname = JSON.parse(localStorage.getItem("countryArr"));
    for(var i = 0; i < countryname.length; i++){
        
                str += '<option class="country" value='+countryname[i]+'>'+countryname[i]+'</option>'

        
            }
            console.log(str)
    $('#country').append(str); 

    // var strsex = "";    
    // $('#sex').html(""); 
    //     strsex += '<option class="country" value="0">女</option>'
    //     strsex += '<option class="country" value="1">男</option>'
    // $('#sex').append(strsex); 
    

}


// =============表格操作============== //
window.operateEvents = {
    'click .fa-edit': function (e, value, row, index) {
        //渲染modal对话框
        editModal(row, "update")
    },
    'click .fa-remove': function (e, value, row, index) {
        $.confirm({
            title: '提醒',
            content: '是否删除该明星？',
            buttons: {
                "确定": function () {
                    $.get(obj.url + '/delFaceToFaceSet?starId='+row._id.toString(), function (result) {
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

// 修改
function editModal(row) {
    obj.listdata = row;
    console.log(row.country.name)
    clearModal();
    var str = "";
    $('#country').html(""); 
    // $("。country").remove();
    var countryname = JSON.parse(localStorage.getItem("countryArr"));
    for(var i = 0; i < countryname.length; i++){
        
                str += '<option class="country" value='+countryname[i]+'>'+countryname[i]+'</option>'

        
            }
    $('#country').append(str); 

    $("#myModalLabe3").html("修改资料")
    $("#updateSubmit").show();
    $("#addSubmit").hide();

    $('#addModal #name').val(row.name);
    $('#addModal #sex').val(row.sex);
    $('#addModal #country').val(row.country.name);
    $('#addModal #introduction').val(row.introduction);
    sessionStorage.setItem("star_id", row._id);
    $("#addModal #img_box").css("display", "block");
    $("#addModal #img_box").css("background-image", "url(" + row.picture + ")")
    $('#addModal').modal('show');
}
function add(){
    addData = {
        name: $('#addModal #name').val(),
        sex:  $('#addModal #sex').val(),
        country: $('#addModal #country').val(),
        introduction: $('#addModal #introduction').val(),
        file: files
    };
    if (!(addData.name && addData.sex && addData.country && addData.introduction && addData.file)) {
        $.alert('缺少参数');
    } else {
        $.post(obj.url+'/addFaceToFaceSet',addData,function(response){
            if (response.code == 1) {
                $('#addModal').modal('hide');
                $.alert('添加成功');
                refresh();
            }else{
                clearModal();
                $.alert(response.err);
            }
        });
    }
}
function edit(){

    editData = {
        _id: sessionStorage.star_id,
        name: $('#addModal #name').val(),
        sex: $('#addModal #sex').val(),
        country: $('#addModal #country').val(),
        introduction: $('#addModal #introduction').val(),
        file: files || ''
    };
    $.post(obj.url+'/editFaceToFaceSet',editData,function(response){
        console.log(response)
        if (response.code == 1) {
            $('#addModal').modal('hide');
            $.alert('修改明星资料成功！');
            refresh();
        }else{
            $.alert("修改失败："+response.err);
        }
    });
}


//上传图片调用的方法
    var uploader = new plupload.Uploader({
        runtimes : 'html5,flash,silverlight,html4',
        browse_button : 'img_box',     //选择文件的按钮。
        //multi_selection: false,
        container: document.getElementById('container'),
        flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
        silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',
        url : 'http://oss.aliyuncs.com',

        //设置上传图片的过滤条件
        filters: {
            mime_types : [ //只允许上传图片和zip,rar文件
            { title : "Image files", extensions : "jpg,png,jpeg" },
            { title : "Zip files", extensions : "zip,rar" }
            ],
            max_file_size : '10mb', //最大只能上传10mb的文件
            prevent_duplicates : true //不允许选取重复文件
        },
        init: {
            PostInit: function() {
                document.getElementById('ossfile').innerHTML = '';
                // 添加
                document.getElementById('addSubmit').onclick = function() {
                    set_upload_param(uploader, '', false);
                    add();

                    return false;
                };
                document.getElementById('updateSubmit').onclick = function() {
                    //设置上传的参数
                    var fileNum = uploader.files.length;
                    // 更换了图片再上传
                    if(fileNum!=0){
                        set_upload_param(uploader, '', false);
                        edit();
                    }else{
                        // $.alert("请选择修改的图片")
                        return
                    }
                    return false;
                };
            },

            BeforeUpload: function(up, file) {
                check_object_radio();
                set_upload_param(up, file.name, true);
            },

            //获取上传后的文件名
            FileUploaded: function(up, file, info) {
                if (info.status == 200)
                {

                    files = get_uploaded_object_name(file.name);
                    console.log(files)
                    $('#img_box').css('background-image','url(http://arpt-user.oss-cn-shenzhen.aliyuncs.com/'+files+')')
                }
                else
                {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = info.response;
                }
            },

            Error: function(up, err) {
                if (err.code == -600) {
                    document.getElementById('console').appendChild(document.createTextNode("\n选择的文件太大了,可以根据应用情况，在upload.js 设置一下上传的最大大小"));
                }
                else if (err.code == -601) {
                    document.getElementById('console').appendChild(document.createTextNode("\n选择的文件后缀不对,可以根据应用情况，在upload.js进行设置可允许的上传文件类型"));
                }
                else if (err.code == -602) {
                    document.getElementById('console').appendChild(document.createTextNode("\n这个文件已经上传过一遍了"));
                }
                else
                {
                    document.getElementById('console').appendChild(document.createTextNode("\nError xml:" + err.response));
                }
            }
        }
    });
    uploader.init();
    uploader.bind('FilesAdded',function(uploader,addFiles){
        // $('#img_box').css('background-image','')
        set_upload_param(uploader, '', false);
        preview(addFiles);
    });

// =============表格操作样式格式化============== //
function operateFormatter(value, row, index) {
    return [
        "<a href='javascript:void(0)'><i id='edit' class='fa fa-edit fa-lg' style='padding: 0 5px 0 5px;' title='编辑信息'></i></a>",
        "<a href='javascript:void(0)'><i id='delete' class='fa fa-remove fa-lg' style='padding: 0 5px 0 5px;' title='删除'></i></a>",
    ].join('');
}

//预览图片
function preview(addFiles){
    // 对addFiles分别生成base64编码，用于预览
    $.each(addFiles || [], function(i, file) {
        if (!file || !/image\//.test(file.type)) return; //确保文件是图片
        if (file.type == 'image/gif') {//gif使用FileReader进行预览,因为mOxie.Image只支持jpg和png
            var fr = new mOxie.FileReader();
            fr.onload = function () {

                file.imgsrc = fr.result;
                fr.destroy();
                fr = null;
            }
            fr.readAsDataURL(file.getSource());
        } else {
            var preloader = new mOxie.Image();
            preloader.onload = function () {
                preloader.downsize(180, 120);//先压缩一下要预览的图片
                var imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80) : preloader.getAsDataURL(); //得到图片src,实质为一个base64编码的数据
                console.log(imgsrc)

                file.imgsrc = imgsrc;

                preloader.destroy();
                preloader = null;
            };
            preloader.load(file.getSource());
        }
    });
}

//获取产品列表
function list() {
    //加载显示数据
    var data = {offset: pages.getOffset(), limit: pages.getLimit()};
    //console.log(data)
    $.get(obj.url + "/FaceToFaceSetList?offset="+data.offset+"&limit="+data.limit, function (result) {
       // console.log(result)
        pages.setCount(result.count);
        footer();

        $('.panel-heading #line').change(function () {
            getStation($(this).children('option:selected').val());
        })

        $('#tables').bootstrapTable({
            classes: 'table table-hover',
            striped: true, //是否显示行间隔色
            // showColumns: true,
            columns: [
                {
                    title: 'ID',
                    align: "center",
                    valign: "middle",
                    field: "star_id",
                    cellStyle: function () {
                        return {
                            css: {
                                "width": "50px;"
                            }
                        }
                    }
                },
                {
                    title: "姓名",
                    field: "name",
                    detailView: true,
                    align: "center",
                    valign: "middle",
                    cellStyle: function () {
                        return {
                            css: {
                                "width": "150px;"
                            }
                        }
                    }
                    , editable: {
                    type: 'text',
                    title: '姓名',
                    validate: function (value) {
                        if ($.trim(value) == '') {
                            return '不能为空';//修改是数据为空 显示
                        }
                    }
                }
                },
                {
                    title: "性别",
                    field: "sex",
                    detailView: true,
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value == 0) {
                            return '女';
                        } else {
                            return '男';
                        }
                    },
                    cellStyle: function () {
                        return {
                            css: {
                                "width": "80px;"
                            }
                        }
                    }

                },
                {
                    title: "图片",
                    field: "picture",
                    detailView: true,
                    align: "center",
                    valign: "middle",
                    formatter: function (value, row, index) {
                        if (value.indexOf("http") != -1) {
                            return "<img class=' imgk' src='" + value + "' alt='' style='width: 150px;height: 150px;'>"
                        } else {
                            return "<img class=' imgk' src='" + HOSTNAME + '/public/images/star/' + value +  "' alt='' style='width: 150px;height: 150px;'>"

                        }
                    },
                    cellStyle: function () {
                        return {
                            css: {
                                "width": "150px;"
                            }
                        }
                    }
                },
                {
                    title: "国籍",
                    field: "country.name",
                    align: "center",
                    valign: "middle",
                    cellStyle: function () {
                        return {
                            css: {
                                "width": "150px;"
                            }
                        }
                    }

                },
                {
                    title: "介绍",
                    field: "introduction",
                    detailView: true,
                    valign: "middle",
                    cellStyle: function () {
                        return {
                            css: {
                                "width": "450px"
                            }
                        }
                    }
                    , editable: {
                    type: 'text',
                    title: '介绍',
                    validate: function (value) {
                        if ($.trim(value) == '') {
                            return '不能为空';//修改是数据为空 显示
                        }
                    }
                }
                },
                {
                    field: 'operate',
                    title: '操作',
                    align: 'center',
                    valign: "middle",//垂直
                    events: operateEvents,
                    formatter: operateFormatter,
                    cellStyle: function () {
                        return {
                            css: {
                                "width": "150px"
                            }
                        }
                    }
                }
            ],
            data: result.rows
            , onEditableSave: function (field, row, old, $el) {
                console.log(field, row, old);
                $("#tables").bootstrapTable("resetView");
                update(row)
            }
        });
    })
}
list();

// 搜索
function search(s) {
    if (s == "name" && $("#search").val()) {
        $.get(obj.url + "/FaceToFaceSetList?name="+$("#search").val(), function (result) {
            pages.setCount(result.count);
            footer();
            $('#tables').bootstrapTable('load', result.rows);
        })
    } else if (s == "country_id" && $("#country_id_select").val() != -1) {
        $.get(obj.url + "/FaceToFaceSetList", {
            key: 'country_id',
            value: $("#country_id_select").val(),
            offset: pages.getOffset(),
            limit: pages.getLimit()
        }, function (result) {
            pages.setCount(result.count);
            footer();
            $('#tables').bootstrapTable('load', result.rows);
        })
    } else {
        refresh()
    }
}
//更新
function update(row) {
    var data = {
        name: $('#addModal #name').val(),
        sex: $('#addModal #sex').val(),
        country: $('#addModal #country').val(),
        introduction: $('#addModal #introduction').val(),
        star: $("#img_box").css("backgroundImage").replace('url(', '').replace(')', ''),
    };
    $.post(obj.url + '/editFaceToFaceSet', data, function (result) {
        if (result.code == 1) {
            refresh();
            $.alert('修改成功');
        }
    });
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
        console.log(pages.getOffset())
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

//刷新列表
function refresh() {
    if (obj.search.length > 0 && obj.search.hasOwnProperty(search)) {
        $.get(obj.url + "/FaceToFaceSetList", obj.search, function (result) {
            pages.setCount(result.count);
            footer();
            $('#tables').bootstrapTable('load', result.rows);
        })
    } else {
        $.get(obj.url + "/FaceToFaceSetList?offset="+pages.getOffset()+"&limit="+pages.getLimit(), function (result) {
            pages.setCount(result.count);
            $('#tables').bootstrapTable('load', result.rows);
            footer();
        })
    }
}

getcountry()

//获取国家名称
function getcountry() {
    var countryArr = []
    $.get(obj.url + '/faceCountryList', function (result) {
        if(result.code == 1){
            // console.log(result.countrys)
            for(var i = 0; i < result.countrys.length; i++){
                countryArr.push(result.countrys[i])
            }
            // console.log(countryArr)
            localStorage.setItem("countryArr", JSON.stringify(countryArr));
        }
    });
}

