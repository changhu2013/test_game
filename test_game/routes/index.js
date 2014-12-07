var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var querystring = require('querystring');

require('../models/Log.js');
require('../models/user.js');

io = global.io;

var router = express.Router();
router.get('/', function(req, res) {
    //判断是否登录
    if(req.session && req.session.user){
        res.render('index', {user : req.session.user});
    }else {
        var query = url.parse(req.url, true).query;
        var sid = query.sid;
        console.log('sid:' + sid);
        if(sid == undefined){
            req.flash('success', '错误的sid');
            res.render('index');
        }else {
            var User = mongoose.model('User');
            User.findOne({
                sid: sid
            }, function (err, user) {
                console.log(user);
                if(err){
                    req.flash('success', '未找到sid:' + sid + '的用户');
                    res.render('index');
                }else {
                    req.flash('success', '登陆成功');
                    req.session.user = user;
                    res.render('index');
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
router.get('/mybattles', function(req, res){
    console.log('我的挑战');
    res.render('mybattles');
});

//某题集下的对战房间
router.get('/warzone', function(req, res){
    var query = url.parse(req.url, true).query;
    var qcid = query.qcid;

    console.log('某题集下的对战房间 ' + qcid);
    res.render('warzone');
});

//战场
router.get('/battle', function(req, res){
    console.log('战场');
    res.render('battle');
});

//排行榜
router.get('/ranklist', function(req, res){
    console.log('排行榜');
    res.render('ranklist');
});

//练兵场
router.get('/drillwar', function(req, res){
    console.log('练兵场');
    res.render('drillwar');
});

//游戏规则
router.get('/manual', function(req, res){
    console.log('游戏规则');
    res.render('manual');
});

module.exports = router;
