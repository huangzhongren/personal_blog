/**
 * Created by bulusi on 2017/8/20.
 * 应用程序的入口文件
 */

var express = require('express');
var app = express();
var swig = require('swig');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);//用来存储session避免服务重启后session销毁
var bodyParser = require('body-parser');//处理post提交过来的数据
var ueditor = require('ueditor');//富文本编辑器
var User = require('./models/user.js');


//定义模板引擎
app.engine('html',swig.renderFile);
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'node_modules')));
app.set('views','./views');//设置模板文件存放目录
app.set('view engine','html');
swig.setDefaults({cache:false});
app.use(bodyParser.urlencoded({extended: true}));

mongoose.Promise = global.Promise;

//设置cookie
app.use(cookieParser());

app.use(session({
    secret:'12345',
    cookie:{maxAge:6000000},
    resave:false,
    saveUninitialized:true,
    store: new MongoStore({
        // url:'mongodb://localhost:27017/blog',
        // touchAfter: 24*3600, //lazy session update
        mongooseConnection:mongoose.connection
    })
}))
//路由拦截
app.use(function(req,res,next){
    var url1 = req.url.split('/')[1];
    if(!req.session.user && req.url!=='/' && !/^api|view|\?/.test(url1)){
        return res.redirect('/');
    }else if(req.session.user){
        //查询是否是管理员
        User.findById(req.session.user._id).then(function(user){
            req.session.user.isAdmin = Boolean(user.isAdmin)
            next();
        })
    }else {
        next();
    }
})
//根据不同的功能划分模块
app.use('/admin',require('./routers/admin'))
app.use('/api',require('./routers/api'))
app.use('/',require('./routers/index'))
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {

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

//创建连接数据库实例化对象
mongoose.connect('mongodb://localhost:27017/blog',{useMongoClient:true},function(err){
    if(err) {
        console.log('连接失败')
    }else {
        console.log('连接成功')
        //监听请求
        app.listen(8888);
    }
})
