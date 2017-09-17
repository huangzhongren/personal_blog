/**
 * Created by bulusi on 2017/8/20.
 */
$(function(){
    $('.go_regist').on('click',function(){
        $('.login').hide();
        $('.regist').show();
    })
    $('.go_login').on('click',function(){
        $('.login').show();
        $('.regist').hide();
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
                    setTimeout(function(){
                        $('.login').show();
                        $('.regist').hide();
                    },1000)
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
                    setTimeout(function(){
                        location.reload();
                    },1000)
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    })
})