var MongoStore = require('connect-mongodb');
var settings = require('./settings');
var mongoose = require('mongoose');

//题集生成的保存目录
global.questionStoreDir = __dirname + '/qs/';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes/index');
//题目
var question = require('./routes/question');
//挑战
var battle = require('./routes/battle');
//后台管理， 包括用户导入和题目导入,报表功能
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser());
app.use(flash());

/* 自己实现cookies  */
/*
app.use(function(req, res, next){

    console.log('headers.cookie');
    console.log(req.headers.cookie);

    req.cookies = {};

    next();
});
*/
/*  自己实现对session的管理开始  */
var EXPIRES = 20 * 60 * 1000;
var generate = function(id){
    var session = {};
    session.id =  id;
    session.cookie = {
        expire : (new Date()).getTime() + EXPIRES
    };
    global.sessionCache[session.id] = session;
    return session;
};

app.use(function(req, res, next){
    if(!global.sessionCache){
        //该缓存池来自于父进程，当单独启动server.js时候是没有该缓存池的，故自己设置
        global.sessionCache = {};
    }
    var key = 'connect.sid';
    var id = req.cookies[key];
    if(!id){ //在QQ浏览器中拿不到connect.sid, UC浏览器中能拿到该值, 用connect.sid作为session_id
        id = (new Date()).getTime() + Math.random();
        req.session = generate(id);
        res.setHeader('Set-Cookie', 'connect.sid=' + id);
    }else {
        console.log(global.sessionCache);
        if(!global.sessionCache[id]){
            req.session = generate(id);
        }else {
            var session = global.sessionCache[id];
            if(session){
                if(session.cookie.expire > (new Date()).getTime()){
                    //更新超时时间
                    session.cookie.expire = (new Date()).getTime() + EXPIRES;
                    req.session = session;
                } else {
                    //超时了, 删除旧的数据，并重新生成
                    console.log('超时了, 删除旧的数据，并重新生成');
                    delete global.sessionCache[id];
                    req.session = generate(id);
                }
            }else {
                //如果session过期或口令不对，重新生成session
                console.log('session过期或口令不对，重新生成session');
                delete global.sessionCache[id];
                req.session = generate(id);
            }
        }
    }
    next();
});
/*  自己实现对session的管理结束  */

//设置将会话信息存数Mongo数据库
/*
app.use(session({
    secret : settings.cookieSecret
    *
    resave:true,
    saveUninitialized:true,
    key: 'sid',
    store : new MongoStore({
        db : settings.db
    })
    *
}));
*/

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//通用变量
app.use(function(req, res, next){
    res.locals.appName = 'test game';
    res.locals.success = req.flash('success');
    res.locals.user = req.session?req.session.user:null;
    next();
});

app.use('/', routes);
app.use('/question', question);
app.use('/battle', battle);
app.use('/admin', admin);

//mongoose
mongoose.connect('mongodb://' + settings.host + '/' + settings.db);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
