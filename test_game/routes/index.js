var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');

require('../models/Log.js');
require('../models/user.js');
require('../models/storebattle.js');
require('../models/battle.js');
require('../models/question.js');

io = global.io;
var User = mongoose.model('User');
var Battle = mongoose.model('Battle');
var Question = mongoose.model('Question');

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
    res.render('honor');
});

//获取荣誉榜用户列表
router.post('/honor/users', function(req, res){
    var query = url.parse(req.url, true).query;
    console.log(query);
    var skip = query.skip || 0;
    var limit = query.limit  || 10;
    User.find().skip(skip).limit(limit).sort({
        score : 'desc'
    }).exec(function(err, users){
        res.send(users);
    });
});

//我的挑战
router.get('/mybattles', function(req, res){
    console.log('我的挑战');
    res.render('mybattles');
});

//某题集下的对战房间
router.get('/warzone/:qs_id', function(req, res){
    console.log('某题集下的对战房间');
    var qs_id = req.params.qs_id;
    res.render('warzone', {
        //qs_id: 表示模型questionstores下的_id
        qs_id: qs_id
    });
});

//战场
router.get('/battle/:qs_id', function(req, res){
    console.log('战场');
    //1.拿到题集编号
    var qs_id = req.params.qs_id;
    //2.通过题集编号去获取试卷号:然后随机一套试卷(当前默认的题集编号为:0-19)
    var paperId = parseInt(Math.random() * 20); //试卷ID
    var path = 'f:\\qs\\' + qs_id + '\\' + paperId + '.json';
    var data=fs.readFileSync(path, "utf-8");
    console.log(data);
    res.render('drillwar', {
        users: [req.session.user],
        qStore: JSON.parse(data) //题目
    });
});

//排行榜
router.get('/ranklist', function(req, res){
    console.log('排行榜');
    res.render('ranklist');
});

//练兵场
router.get('/drillwar/:qs_id', function(req, res){
    //1.拿到题集编号
    var qs_id = req.params.qs_id;
    //2.通过题集编号去获取试卷号:然后随机一套试卷(当前默认的题集编号为:0-19)
    var paperId = parseInt(Math.random() * 20); //试卷ID
    var path = 'f:\\qs\\' + qs_id + '\\' + paperId + '.json';
    var data=fs.readFileSync(path, "utf-8");
    console.log(data);
    res.render('drillwar', {
        users: [req.session.user],
        qStore: JSON.parse(data) //题目
    });
});

//游戏规则
router.get('/manual', function(req, res){
    console.log('游戏规则');
    res.render('manual');
});

//校验答案
router.post('/question/valianswer', function (req, res) {
    console.log('校验答案');
    var _id = req.query._id;
    var answer = req.query.answer;

    Question.findOne({
        _id: Question.ObjectId(_id)
    }, function(err, data){
        console.log(data);
        if(data){
            res.send({
                success: true
            });
        } else {
            res.send({
                success: false
            })
        }
    })
});

module.exports = router;
