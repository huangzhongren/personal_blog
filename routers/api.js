/**
 * Created by bulusi on 2017/8/20.
 */

var router = require('express').Router();
var User = require('../models/user');
//定义统一返回格式
var responseData;
router.use(function(req,res,next){
    responseData = {
        code:0,
        message:''
    }
    next();
})
/*注册逻辑
*   1.用户名、密码不能为空
*   2.两次输入密码一致
*   3.用户名是否被注册
*       数据库查询
* */
router.post('/user/register',function(req,res,next){
    console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if(username === ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空'
        res.json(responseData)
        return;
    }
    if(password === ''){
        responseData.code = 2;
        responseData.message = '密码不能为空'
        res.json(responseData)
        return;
    }
    if(password!==repassword){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致'
        res.json(responseData)
        return;
    }
    //验证用户名是否被注册
    User.findOne({
        username: username
    }).then(function(userInfo){
        if(userInfo){
            responseData.code = 4;
            responseData.message = '用户名已经被注册';
            res.json(responseData);
            return;
        }
        //保存用户信息到数据库中
        var user = new User();
        user.username = username;
        user.password = password;
        return user.save();
    }).then(function(newUserInfo){
        responseData.message = '注册成功';
        res.json(responseData)
    })
})
/*登录逻辑
*   1.验证是否为空
*   2.查找数据库是否存在用户
*   3.验证密码
* */
router.post('/user/login',function(req,res,next){
    var username = req.body.username;
    var password = req.body.password;
    if(username===''){
        responseData.code = 1;
        responseData.message = '用户名不能为空'
        res.json(responseData)
        return;
    }
    if(password===''){
        responseData.code = 2;
        responseData.message = '密码不能为空'
        res.json(responseData)
        return;
    }
    User.findOne({
        username: username,
        password: password
    }).then(function(userInfo){
        if(userInfo){
            req.session.user = userInfo;
            responseData.message='登录成功'
        }else {
            responseData.code=2;
            responseData.message='用户名或密码错误';
            res.json(responseData)
            return;
        }
        res.json(responseData)
    })
})
/*
* 退出登录
* */

router.get('/user/logout',function(req,res,next){
    req.session.user = null;
    return res.redirect('/');
})
module.exports = router;