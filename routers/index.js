/**
 * Created by bulusi on 2017/8/20.
 */


var router = require('express').Router();
var Category = require('../models/category');

router.get('/',function(req,res,next){
    console.log(req.session.user)
    //读取所有的分类信息
    Category.find().then(function(results){
        console.log(results)
        res.render('main/index',{
            user:req.session.user,
            categories: results
        })
    })

})

module.exports = router;