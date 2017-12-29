/**
 * Created by Administrator on 2017/3/4.
 */
//============搜索============
$("#ref").click(function () {
    pages.ref();
    $("#search").val("")
    refresh();
})
$("#up").click(function(){
    pages.setup();
    if($("#search").val()){
        search()
    }else{
        refresh();

    }
})
$("#down").click(function(){
    pages.setdown();
    if($("#search").val()){
        search()
    }else{
        refresh();

    }
})
$("#start").click(function(){
    pages.setoffs(0);
    if($("#search").val()){
        search()
    }else{
        refresh();

    }
})


/*$("#end").click(function(){
    pages.setoffs(pages.count-pages.limits+1);
    if($("#search").val()){
        search()
    }else{
        refresh();

    }
})*/


// ========分页=============//
function pages() {
    this.offs=0;
    this.limits=5;
    this.count=100;
}
pages.prototype.getoffs=function () {
    return  this.offs;
}
pages.prototype.setoffs=function (o) {
    this.offs=o;
}
pages.prototype.getlimit=function () {
    return this.limits;
}
pages.prototype.setlimit=function (l) {
    this.limits=l;
}
pages.prototype.setup=function () {
    if(this.offs-this.limits<0){
        layer.msg("已经是首页了",{icon: 2, time: 500})
    }else{
        this.offs=this.offs-this.limits<0?0:(this.offs-this.limits);
    }
}
pages.prototype.setdown=function () {
    if(this.offs+this.limits>this.count){
        layer.msg("没有了",{icon: 2, time: 500})
    }else{
        this.offs=this.offs+this.limits>this.count?this.offs:(this.offs+this.limits);
    }
}
pages.prototype.setcount=function (c) {
    this.count=c;
}
pages.prototype.getcount=function () {
    return this.count;
}
pages.prototype.ref=function () {
    this.offs=0;
    this.limits=5;
}
var pages =new pages();