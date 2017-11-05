/**
 * Created by bulusi on 2017/8/20.
 */


var router = require('express').Router();
var Category = require('../../models/category');
var Content = require('../../models/contents');
var ueditor = require('ueditor');//富文本编辑器
var path = require('path');

var _ = require('lodash')
/*处理通用数据
* */
var data = {}
router.use(function(req,res,next){
    data = {
        user: req.session.user,
        categories:[]
    }
    //读取所有的分类信息
    Category.find().then(function(results){
        data.categories = results;
        next();
    })
})
/*
注册

*/
router.get('/register',function(req,res,next){
    res.render('main/register')
})
/*
* 首页
* 需要展示内容：
* 导航分类信息|文章内容信息|文章内容分页
* */
router.get('/',function(req,res,next){

    data = _.assign(data,{//合并对象
        limit: 4,
        pages: 0,
        page: req.query.page||'',
        count:0,
        contents:[],
        category:req.query.category||''
    })
    var where = {};
    if(data.category){
        where.category = data.category
    }
    Content.where(where).count().then(function(count){
        data.count = count;
        data.pages = Math.ceil(data.count/data.limit);
        data.page = Math.min(data.pages,data.page);
        data.page = Math.max(data.page,1);
        var skip = (data.page-1)*data.limit;
        return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
            addTime:-1
        })
    }).then(function(contents){
        data.contents = contents;
        res.render('main/index',data)
    })
})
/*
* 文章详情页
* */
router.use('/view',function(req,res,next){
    var content_id = req.query.content_id;
    Content.findOne({
        _id:content_id
    }).populate(['user','category']).then(function(content){
        data.content = content;

        if(req.url.split('?')[0]=='/'){
            content.views++;
            content.save();
        }
        next();
    })
})
router.get('/view',function(req,res){
    //查询最近10条数据用于显示
    Content.find().sort({
        _id: -1
    }).limit(10).then(function(rs){
        data.recentRecord = rs;
        res.render('main/view',data)
    })
})
/*评论模块*/
router.get('/view/comments',function(req,res){
    res.render('main/comments',data)
})

//富文本
router.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {

    // ueditor 客户发起上传图片请求

    if(req.query.action === 'uploadimage'){

        // 这里你可以获得上传图片的信息
        var foo = req.ueditor;
        console.log(foo.filename); // exp.png
        console.log(foo.encoding); // 7bit
        console.log(foo.mimetype); // image/png

        // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
        var img_url = '/uploadImage';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = '/img'; // 要展示给客户端的文件夹路径
        res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        // 这里填写 ueditor.ueditor.config.json 这个文件的路径
        res.redirect('/ueditor/ueditor.config.json')
    }}));
module.exports = router;