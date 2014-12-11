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
require('../models/questionstore.js');

io = global.io;
var User = mongoose.model('User');
var Battle = mongoose.model('Battle');
var Question = mongoose.model('Question');
var QuestionStore = mongoose.model('QuestionStore');
var StoreBattle = mongoose.model('StoreBattle');

//保存题集下战场的记录(包括练习和联网对战)
var questionBattleData = [];
/*var questionBattleData = {
    //战场ID
    bid: {
        users: {
            sid: {
                qsid : 'xxxxx',
                //道具数量
                property: 2,
                //进度
                progress: 50,
                //连续答对的题目
                serialValidity: 0,
                //答对题目
                validity:[],

                //打错题目
                mistake: []
            }
        }
    }
};*/


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
    var questionData = fs.readFileSync(path, "utf-8");
    /*console.log(data);*/

    QuestionStore.findById(qs_id, function (err, questionStoreData) {
        if(err) return;
        //存储对战信息
        var nowTime = new Date();
        var battle = new Battle();
        battle['sid'] = req.session.user.sid;
        battle['sname'] = req.session.user.name;
        battle['status'] = 'I'; //正在进行状态
        battle['qsid'] = qs_id; //题集ID
        battle['qstitle'] = questionStoreData.get('title');
        battle['start'] = nowTime;//挑战开始时间

        battle.save(function (err, battleData) {
            //该战役的ID
            var bid = battleData.get('_id').toString();
            var sid = req.session.user.sid;
            StoreBattle.findOne({'sid': sid}, function (err, storeBattleData) {
                if(storeBattleData){
                    StoreBattle.update({
                        sid: sid,
                        qsid: qs_id,
                        bid: bid,
                        lastTime: battleData.get('start')
                    }, function (err, data) {
                        res.render('drillwar', {
                            users: [req.session.user],
                            bid: bid,
                            qstitle: questionStoreData.get('title'),
                            qStore: JSON.parse(questionData) //题目
                        });
                    });
                } else {
                    var storeBattle = new StoreBattle();
                    storeBattle['sid'] = sid;
                    storeBattle['qsid'] = qs_id;
                    storeBattle['bid'] = bid;
                    storeBattle['lastTime'] = battleData.get('start');
                    storeBattle.save(function (err , data) {
                        res.render('drillwar', {
                            users: [req.session.user],
                            bid: bid,
                            qstitle: questionStoreData.get('title'),
                            qStore: JSON.parse(questionData) //题目
                        });
                    });
                }
            });

            questionBattleData[bid] = {};
            var users = {};
            users[sid] = {};
            users[sid] = {
                qsid: qs_id,
                property: 0,
                progress: 0,
                serialValidity: 0,
                validity: [], //答对题目
                mistake: [] //打错题目
            }
            questionBattleData[bid]['users'] = users;
        });
    });
});

//游戏规则
router.get('/manual', function(req, res){
    console.log('游戏规则');
    res.render('manual');
});

//校验答案,返回答案的正确,还有自己和其他队友的信息(进度),
// 自己的拖后腿的道具数量,自己连续答对题目的数量
router.post('/question/valianswer', function (req, res) {
    console.log('校验答案');

    var _id = req.query._id;
    var answer = req.query.answer;
    var bid = req.query.bid; //战场ID

    Question.findById(_id, function(err, data){
        console.log(data);
        var bidInfo = questionBattleData[bid]; //战场信息
        var sid = req.session.user.sid;
        var userInfo = bidInfo['users'][sid];

        if(data && data.get('answer') == answer){ //答对
            userInfo.validity.push(_id); //更新答对题目ID
            userInfo.progress = userInfo.validity.length / 20; //进度
            userInfo.serialValidity++; //连续答对

            if(userInfo.serialValidity == 5){//当连续答对5道题时候,增加一个道具
                userInfo.property++; //增加一个道具
                userInfo.serialValidity = 0; //并将连续答对的题目清0
            }
            res.send({
                success: true,
                battleData: bidInfo
            });
        } else {
            userInfo.mistake.push(_id); //更新答对题目ID
            res.send({
                success: false,
                battleData: bidInfo
            })
        }
    })
});

module.exports = router;
