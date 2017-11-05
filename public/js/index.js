/**
 * Created by bulusi on 2017/8/20.
 */
$(function(){
    //获取url中search参数并转化为json对象
    //@param uri:任意字符对象
    var querySearch = function (uri){
        var reg = new RegExp('\\?+\\.+');
        if(uri.match(reg)===null){
            return null
        }
        var str = uri.match(reg)[0],
            json = {};
        str.split('&').forEach(function(item){
            var key = item.split('=')[0];
            var value = item.split('=')[1];
            json[key] = value;
        })
        return json;
    }
    //登录、注册链接跳转
    $('#login,#register').click(function(){
        this.href += '?back='+encodeURIComponent(location.href)
    })

    var registerBox = $('.regist')
    //注册
    registerBox.find('[type="submit"]').on('click',function(){
        $.ajax({
            url:'/api/user/register',
            type:'post',
            dataType: 'json',
            data: {
                username:registerBox.find('[name="username"]').val(),
                password:registerBox.find('[name="password"]').val(),
                repassword:registerBox.find('[name="repassword"]').val(),
            },
            success: function(json){
                registerBox.find('.col_warning').html(json.message).show();
                if(!json.code){
                    var modal = $('body').myModal({
                        type:'modal-sm',
                        backdrop:false,
                        msg:json.message||'注册成功',
                        closeEvent: function(){
                            location.href='/login'+location.search;
                        }
                    })
                }else {
                    var modal = $('body').myModal({
                        type:'modal-sm',
                        duration:2000,
                        width: 300,
                        height: 150,
                        backdrop:false,
                        msg:json.message||'验证失败',
                    })
                }
            }
        })
    })

    var loginBox = $('.login');

    loginBox.find('[type="submit"]').on('click',function(){
        $.ajax({
            url:'/api/user/login',
            type:'post',
            data:{
                username:loginBox.find('[name="username"]').val(),
                password:loginBox.find('[name="password"]').val()
            },
            dataType:'json',
            success: function(json){
                loginBox.find('.col_warning').html(json.message).show()
                if(!json.code){
                    //跳转到触发登陆、注册的页面
                    location.href = querySearch(location.href)||'/';
                }else {
                    var modal = $('body').myModal({
                        type:'modal-sm',
                        duration:2000,
                        width: 300,
                        height: 150,
                        backdrop:false,
                        msg:json.message||'登陆失败',
                    })
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })

})