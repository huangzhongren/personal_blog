/*
* 说明：
* 1、基于bootstrap的模态框增加一些扩展
*
*
*
*
* 该插件可以应用给局部元素，因此会默认给模态框的父级元素加上相对定位，使用前请确认不会影响页面结构
*
* 弹窗或动画会默认出现在父级元素的水平垂直剧中的位置，请确保父级元素都拥有高度和宽度。
* */



(function(root,factory,plug){
    typeof exports === 'object' && typeof module !== 'undefined'?module.exports = factory:

    typeof define === 'function'?typeof define.amd !== define(factory):

    factory.call(root,jQuery,plug)
})(this,function($,plug){
    //模态框默认配置
    var __DEFES__ = {
        title:'dialog',//弹窗标题
        msg:'',//弹窗内容,支持html插入
        width: "600",
        height: "300",
        type:'modal',//提供三种类型（modal、loading、modal-sm）
        backdrop: false,//是否开启遮罩
        backdrop_style:'',//自定义遮罩样式,必须backdrop为true时才有效,只支持JSON格式
        keyboard:true,//是否开启esc建退出
        remote:"",//远程加载url,在没有配置msg时有效
        openEvent:null,//弹窗打开后的会回调函数
        closeEvent:null,//弹窗关闭后的回调函数
        okEvent: null,//点击确定按钮的回调函数
    }
    var __TEMP__ = {
        'modal':'<div id="myModal_modal" class="modal fade" role="dialog" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true" >' +
        '<div class="modal-dialog" style="display:table-cell"><div class="modal-content">' +
        '<div class="modal-header"><button type="button" class="close" data-dismiss="modal" ><span aria-hidden="true">&times;</span>' +
        '<span class="sr-only">Close</span></button><h4 id="myModalLabel" class="modal-title"></h4></div>' +
        '<div class="modal-body" ><p>正在加载...</p></div><div class="modal-footer"><button class="btn" data-dismiss="modal" aria-hidden="true">取消</button>' +
        '<button class="btn btn-primary ok">确定</button></div></div></div></div>'+
        '<div class="myBackdrop" style="display: none"></div>',
        'loading':'<div id="myModal_loading" class="modal fade" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true" >' +
        '<div style=" background-color: #fff;bottom: 0;left: 0;position: absolute;right: 0;top: 0;transition: opacity 0.15s linear 0s;opacity: 0.5;">' +
        '<div class="modal-dialog"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div></div>',
        'modal-sm':'<div id="myModal_modal-sm" class="modal fade" role="dialog" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true" >' +
        '<div class="modal-dialog" style="display:table-cell"><div class="modal-content"><div class="modal-body"></div></div></div></div>'//极简弹窗
    }
    var backdrop_DF_style = {
        backgroundColor:'#000',
        left:0,
        top:0,
        opacity:0.5,
        width:'100%',
        height:'100%',
        transition:'opacity 0.15s linear 0s',
        position:'absolute',
    }
    $.fn[plug] = function(opts){
        var opts = $.extend({},__DEFES__,opts),
            template = __TEMP__[opts.type];
        var customCss = $.extend(backdrop_DF_style,opts.backdrop_style);
        this.append(template).css({
            position:'relative'
        });
        var modalTitle = $('.modal-title').text(opts.title)
        var backdrop = $('.myBackdrop').css(customCss);
        var modal = $('#myModal_'+opts.type);
        modal.modal({
            backdrop:false,
            keyboard:opts.keyboard
        })
            .css({
                position:'absolute',
                width:opts.width,
                height:opts.height,
                left:(this.width()-opts.width)/2,
                top:(this.height()-opts.height)/2
            })
            .on('hidden.bs.modal',function(){
                if(opts.closeEvent && typeof opts.closeEvent ==='function'){
                    opts.closeEvent()
                }
                backdrop.hide();
            })
            .on('shown.bs.modal',function(){
                opts.backdrop?backdrop.show():backdrop.hide();
                if(opts.openEvent && typeof opts.openEvent ==='function'){
                    opts.openEvent()
                }
                if(opts.duration&&!isNaN(Number(opts.duration))){
                    setTimeout(function(){
                        modal.modal('hide')
                    },opts.duration)
                }
            })
        var modal_body =$('.modal-body');
        opts.msg?modal_body.html(opts.msg):opts.remote?modal_body.load(opts.remote,function(err){
            console.log(err)
        }):'';
        $('.ok').click(function(){
            if(opts.okEvent&&typeof opts.okEvent==='function'){
                opts.okEvent();
                modal.modal('hide')
            }
        })
        return modal
    }




},'myModal')