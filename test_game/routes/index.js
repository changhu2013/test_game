var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var util = require('../models/util.js');
var querystring = require('querystring');
var fs = require('fs');
var BattleIo = require('../models/BattleIo.js');

require('../models/Log.js');
require('../models/user.js');
require('../models/storebattle.js');
require('../models/battle.js');
require('../models/question.js');
require('../models/questionstore.js');

var Setting = require('../models/setting.js');

io = global.io;

var Log = mongoose.model('Log');
var User = mongoose.model('User');
var Battle = mongoose.model('Battle');
var Question = mongoose.model('Question');
var QuestionStore = mongoose.model('QuestionStore');
var StoreBattle = mongoose.model('StoreBattle');

var router = express.Router();
router.get('/', function(req, res) {
    var query = url.parse(req.url, true).query;
    var sid = query.sid;

    //回到首页,清理战场数据
    BattleIo.removeWarDataByUser(sid);
    //回到首页,清理战斗数据
    BattleIo.removeBattleDataByUser(sid);


    console.log('sid:' + sid);
    //判断是否登录
    console.log("当前session信息:" + JSON.stringify(req.session.user));
    if(false && req.session && req.session.user && (sid == req.session.user.sid)){
        res.render('index', {user : req.session.user});
    }else {
        if(sid == undefined){
            req.flash('success', '错误的sid');
            res.render('index');
        }else {
            User.findOne({
                sid: sid
            }, function (err, user) {
                console.log("当前登陆信息:" + JSON.stringify(user));

                console.log(err);
                if(err || user == null){
                    req.session.user = null;
                    req.flash('success', '未找到sid:' + sid + '的用户');
                    res.render('index');
                }else {

                    req.flash('success', '登陆成功');
                    console.log('【' + sid + '】登陆成功');
                    req.session.user = user;
                    res.render('index', {user : req.session.user});
                }
            });
        }
    }
});

//主界面
router.get('/main', function(req, res){
    console.log('主界面');
    var sid = req.session.user.sid;
    //回到首页,清理战场数据
    BattleIo.removeWarDataByUser(sid);
    //回到首页,清理战斗数据
    BattleIo.removeBattleDataByUser(sid);
    res.render('main');
});

//荣誉榜
router.get('/honor', function (req, res) {
    var sid = req.session.user.sid;
    //回到首页,清理战场数据
    BattleIo.removeWarDataByUser(sid);
    //回到首页,清理战斗数据
    BattleIo.removeBattleDataByUser(sid);
    res.render('honor');
});

//获取荣誉榜用户列表
router.post('/honor/users', function(req, res){
    var query = url.parse(req.url, true).query;
    console.log(query);
    var skip = query.skip || 0;
    var limit = query.limit  || 10;
    User.find({
        score : {
            $gt : 0
        }
    }).skip(skip).limit(limit).sort({
        score : 'desc'
    }).exec(function(err, users){
        res.send(users);
    });
});

//我的挑战
router.get('/mybattles', function(req, res){
    var sid = req.session.user.sid;
    //回到首页,清理战场数据
    BattleIo.removeWarDataByUser(sid);
    //回到首页,清理战斗数据
    BattleIo.removeBattleDataByUser(sid);
    res.render('mybattles');
});

//某题集下的对战房间
router.get('/warzone/:qs_id', function(req, res){
    var sid = req.session.user.sid;
    //回到首页,清理战场数据
    BattleIo.removeWarDataByUser(sid);
    //回到首页,清理战斗数据
    BattleIo.removeBattleDataByUser(sid);
    console.log('某题集下的对战房间');
    var qs_id = req.params.qs_id;
    QuestionStore.findById(qs_id, function (err, data) {
        if(err) throw err;
        BattleIo.joinWarZone(qs_id, req.session.user.sid, req.session.user.name);
        res.render('warzone', {
            qs_id: qs_id, //qs_id: 表示模型questionstores下的_id
            title: data.get('title').toString()
        });
    })
});

//排行榜
router.get('/ranklist/:qs_id', function(req, res){
    var sid = req.session.user.sid;
    //回到首页,清理战场数据
    BattleIo.removeWarDataByUser(sid);
    //回到首页,清理战斗数据
    BattleIo.removeBattleDataByUser(sid);
    var qs_id = req.params.qs_id;
    console.log(qs_id);
    QuestionStore.findById(qs_id, function (err, data) {
        if(err) throw err;
        console.log(data);
        res.render('ranklist', {
            store : data
        });
    });
});

router.post('/ranklist', function(req, res){
    var query = url.parse(req.url, true).query;
    console.log(query);
    var qsid = query.qsid;
    var skip = query.skip || 0;
    var limit = query.limit  || 10;

    StoreBattle.find({
        'qsid': qsid
    }).sort({
        maxBattleScore: 'desc'
    }).skip(skip).limit(limit).exec(function (err, data) {
        if(err) throw err;
        data = util.toJSON(data);
        res.send(data);
    });
});

//游戏规则
router.get('/manual', function(req, res){
    var sid = req.session.user.sid;
    //回到首页,清理战场数据
    BattleIo.removeWarDataByUser(sid);
    //清理战斗数据
    BattleIo.removeBattleDataByUser(sid);
    console.log('游戏规则');
    res.render('manual');
});

module.exports = router;