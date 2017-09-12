/**
 * Created by bulusi on 2017/8/20.
 */

var router = require('express').Router();
var User = require('../models/user.js');
var Category = require('../models/category.js');
var Content = require('../models/contents.js');

router.use(function(req,res,next){
    if(!req.session.user.isAdmin){
        res.send('对不起，只有管理员才能进入后台管理');
        return;
    }
    next();
})
router.get('/',function(req,res,next){
    res.render('admin/index',{
        user: req.session.user
    })
})
//用户管理
router.get('/user',function(req,res,next){
    /*
    * 从数据库获取所有的用户数据
    *
    * limit(Number): 限制获取数据的条数
    * skip(Number): 忽略数据的条数
    * */
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    User.count().then(function(count){
        pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        User.find().limit(limit).skip(skip).then(function(users){
            res.render('admin/user_index',{
                user:req.session.user,
                users:users,
                page: page,
                count: count,
                pages:pages,
                limit: limit,
            })
        })
    })
})
//分类管理首页
router.get('/category',function(req,res){
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    Category.count().then(function(count){
        pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        Category.find().sort({_id:-1}).limit(limit).skip(skip).then(function(categories){
            res.render('admin/category_index',{
                user:req.session.user,
                categories:categories,
                page: page,
                count: count,
                pages:pages,
                limit: limit,
            })
        })
    })
})
/*
* 分类的添加
* */
router.get('/category/add',function(req,res){
    res.render('admin/category_add.html',{
        user:req.session.user,

    })
})
/*
* 分类的保存
* */
router.post('/category/add',function(req,res){
    var category_name = req.body.category_name||'';
    if(category_name == ''){
        res.render('admin/error.html',{
            user:req.session.user,
            message:"名称不能为空",
            url:''
        })
    }
    //数据库中是否存在同名名称
    Category.findOne({
        name:category_name
    }).then(function(rs){
        if(rs){
            res.render('admin/error.html',{
                user:req.session.user,
                message:"分类名称已存在",
                url:''
            })
            return Promise.reject();
        }else {
            //数据库中不存在
            return new Category({
                name: category_name
            }).save()
        }
    }).then(function(newCategory){
        res.render('admin/success.html',{
            user:req.session.user,
            message:"分类保存成功",
            url:'/admin/category'
        })
    })
})
/*
* 分类修改
* */
router.get('/category/modify',function(req,res){
    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id||'';
    Category.findOne({
        _id:id
    }).then(function(category){
        if(category){
            res.render('admin/category_edit',{
                user:req.session.user,
                category:category
            })
        }else {
            res.render('admin/error',{
                user:req.session.user,
                message:'分类信息不存在'
            })
        }
    })
})

/*
 * 分类的修改保存
 * */
router.post('/category/modify',function(req,res){
    var id = req.query.id||'';
    var category_name = req.body.category_name||'';
    if(category_name == ''){
        return res.render('admin/error.html',{
            user:req.session.user,
            message:"名称不能为空",
            url:''
        })
    }
    //数据库中是否存在同名名称
    Category.findOne({
        _id:id
    }).then(function(category){
        if(!category){
            res.render('admin/error',{
                user:req.session.user,
                message:'分类信息不存在'
            })
            return Promise.reject();
        }else {
            if(category.name == category_name){
                res.render('admin/success',{
                    user:req.session.user,
                    message:'修改成功',
                    url:'/admin/category'
                })
                return Promise.reject();
            }else {
                return Category.findOne({
                    _id:{$ne: id},
                    name: category_name
                })
            }
        }
    }).then(function(sameCategory){
        if(sameCategory){
            res.render('admin/error',{
                user:req.session.user,
                message:"数据库中已存在同名分类",
            })
            return Promise.reject();
        }else {
            Category.update({
                _id:id
            },{
                name:category_name
            }).then(function(){
                res.render('admin/success',{
                    user:req.session.user,
                    message:"修改成功",
                    url:'/admin/category'
                })
            })
        }

    })
})
/*
* 分类的删除
*
* */
router.get('/category/delete',function(req,res){
    var id = req.query.id||'';
    Category.findOne({
        _id:id
    }).then(function(category){
        if(category){
            Category.remove({
                _id:id
            }).then(function(){
                res.render('admin/success',{
                    user:req.session.user,
                    message:'删除成功',
                    url:'/admin/category'
                })
            })
        }else {
            res.render('admin/error',{
                user:req.session.user,
                message:'删除的分类不存在'
            })
        }
    })
})
/*
* 内容首页
*
* */
router.get('/content',function(req,res){
    var page = Number(req.query.page || 1);
    var limit = 4;
    var pages = 0;
    Content.count().then(function(count){
        pages = Math.ceil(count/limit);
        page = Math.min(page,pages);
        page = Math.max(page,1);
        var skip = (page-1)*limit;
        Content.find().limit(limit).skip(skip).then(function(contents){
            res.render('admin/content_index',{
                user:req.session.user,
                contents:contents,
                page: page,
                count: count,
                pages:pages,
                limit: limit,
            })
        })
    })


})
/*
* 内容添加页面
* */
router.get('/content/add',function(req,res){


    Category.find().sort({_id:-1}).then(function(categories){
        res.render('admin/content_add',{
            user:req.session.user,
            categories:categories
        })
    })
})
/*
*
* 内容保存
* */
router.post('/content/add',function(req,res){
    console.log(req.body)
    if(req.body.category == ''){
        res.render('admin/error',{
            user: req.session.user,
            message:'内容分类不能为空'
        })
        return;
    }
    if(req.body.title == ''){
        res.render('admin/error',{
            user: req.session.user,
            message:'内容标题不能为空'
        })
        return;
    }
    //保存数据到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).save().then(function(rs){
        if(rs){
            res.render('admin/success',{
                user: req.session.user,
                message:'内容保存成功',
                url:'/admin/content'
            })
        }
    })

})
module.exports = router;