var MongoStore = require('connect-mongodb');
var settings = require('./settings');

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');
//荣誉榜
var honor = require('./routes/honor');
//题目
var question = require('./routes/question');

//战场列表
var wars = require('./routes/wars');

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
//设置将会话信息存数Mongo数据库
app.use(session({
    secret : settings.cookieSecret
    /*
    resave:true,
    saveUninitialized:true,
    key: 'sid',
    store : new MongoStore({
        db : settings.db
    })
    */
}));

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
app.use('/users', users);
app.use('/honor', honor);
app.use('/question', question);
app.use('/wars', wars);

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
