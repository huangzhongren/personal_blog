/**
 * Created by zhangrz on 2017/6/2.
 * Copyright© 2015-2020 DianDaInfo (https://github.com/diandainfo)
 * @version 0.0.1 created
 */

"use strict";

const router = require('express').Router()
 

// 登录 - 页面
router.get('/', function(req, res) {
    if(req.session.user){
        return res.redirect('/');
    }else {
        res.render('main/login')
    }
});

module.exports = router;