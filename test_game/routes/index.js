var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var querystring = require('querystring');
var util = require('../models/util.js');

require('../models/Log.js');
require('../models/user.js');
require('../models/battle.js');
require('../models/storebattle.js');

io = global.io;
var User = mongoose.model('User');
var Battle = mongoose.model('Battle');
var StoreBattle = mongoose.model('StoreBattle');

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
        res.send(util.toJSON(users));
    });
});

//我的挑战
router.get('/mybattles', function(req, res){
    console.log('我的挑战');
    res.render('mybattles');
});
router.post('/mybattles', function (req, res) {
    var query = url.parse(req.url, true).query;
    console.log(query);
    var skip = query.skip || 0;
    var limit = query.limit  || 10;
    var user = req.session.user;
    Battle.find({
        status : 'N',
        sid : user.sid
    }).skip(skip).limit(limit).exec(function(err, battles){
        battles = util.toJSON(battles);
        var qsids = [];
        for(var i = 0; i < battles.length; i++){
            var b = battles[i];
            qsids.push(b.qsid);
        }
        StoreBattle.find({
            qsid : {
                $in : qsids
            }
        }).exec(function(err, stores){
            stores = util.toJSON(stores);
            for(var j = 0; j < battles.length; j++){
                var b = battles[j];
                for(var k = 0; k < stores.length; k++){
                    var s = stores[k];
                    if(b.qsid == s.qsid){
                        b.store = s;
                        break;
                    }
                }
            }
            res.send(battles);
        });

    });
});

//某题集下的对战房间
router.get('/warzone/:qsid', function(req, res){
    console.log('某题集下的对战房间');
    var qsid = req.params.qsid;
    res.render('warzone', {
        qsid: qsid
    });
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
router.get('/drillwar/:qsid', function(req, res){
    console.log(req.params.qsid + '题集下的练兵场');
    res.render('drillwar');
});

//游戏规则
router.get('/manual', function(req, res){
    console.log('游戏规则');
    res.render('manual');
});

module.exports = router;
