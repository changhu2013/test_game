var express = require('express');
var url = require('url');
var querystring = require('querystring');

var User = require('../models/user.js');
var Logger = require('../models/logger.js');

var router = express.Router();
router.get('/', function(req, res) {
    //判断是否登录
    if(req.session && req.session.user){
        res.render('index', {user : req.session.user});
    }else {
        var query = url.parse(req.url, true).query;
        var sid = query.sid;
        if(sid == undefined){
            req.flash('success', '错误的sid');
            res.render('index', {user : null});
        }else {
            User.get(sid, function(err, user){
                if(err){
                    req.flash('success', '未找到sid:' + sid + '的用户');
                    res.render('index');
                }else {
                    req.flash('success', '登陆成功');
                    req.session.user = user;
                    Logger.login(user, function(){
                        res.render('index', {user : user});
                    });
                }
            });
        }
    }
});

//主界面
router.get('/main', function(req, res){
    console.log('主界面');
    res.render('main');
});

//荣誉榜
router.get('/honor', function (req, res) {
    console.log('荣誉榜');
    res.render('honor');
});

//我的挑战
router.get('/battles', function(req, res){
    console.log('我的挑战');
    res.render('battles');
});

//游戏规则
router.get('/manual', function(req, res){
    console.log('游戏规则');
    res.render('manual');
});

module.exports = router;
