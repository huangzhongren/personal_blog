/**
 * Created by bulusi on 2017/8/20.
 */


var router = require('express').Router();

var User = require('../models/user.js');



router.use('/login',require('./login'))

router.use('/',require('./web'))

router.use('/api',require('./api'))

router.use('/admin',require('./admin'))
//错误拦截
router.use(function(err,req,res,next){
    if(err){
        throw err
    }
})
// 404拦截
router.use(function (req, res) {
    return res.json({
        message: "无效的请求地址"
        , status: 404
    });
});
module.exports = router;