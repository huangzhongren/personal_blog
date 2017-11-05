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

app.use('/',require('./routers'))



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
