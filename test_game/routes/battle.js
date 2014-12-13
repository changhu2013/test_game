var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var util = require('../models/util.js');
var fs = require('fs');
var Setting = require('../models/setting.js');
var BattleIo = require('../models/BattleIo.js')

require('../models/battle.js');
require('../models/questionstore.js');
require('../models/storebattle.js');

var router = express.Router();
var Battle = mongoose.model('Battle');
var QuestionStore = mongoose.model('QuestionStore');
var StoreBattle = mongoose.model('StoreBattle');

//题集生成的保存目录
var questionStoreDir = global.questionStoreDir;

//保存题集下战场的记录(包括练习和联网对战)
var questionBattleData = {};
global.questionBattleData = questionBattleData;
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
 mistake: [],

 //状态: I-正在进行 E-跑路 C-完成
 status: 'I'
 }
 }
 }
 };*/

//最近参加的战区
router.post('/laststore', function(req, res) {
    var query = url.parse(req.url, true).query,
        skip = query.skip || 0,
        limit = query.limit || 10;
    var user = req.session.user;
    StoreBattle.find({
        sid : user.sid
    }).sort({
        lastTime : -1
    }).skip(skip).limit(limit).exec(function(err, battles){
        battles = util.toJSON(battles);
        var qsids = [];
        for(var k = 0; k < battles.length; k++){
            var t = battles[k].qsid;
            qsids.push(t);
        }
        QuestionStore.find({
            _id : {
                $in : qsids
            }
        }, function(err, stores){
            stores = util.toJSON(stores);
            for(var i = 0; i < battles.length; i++){
                var b = battles[i];
                for(var j = 0 ;j < stores.length; j++){
                    var s = stores[j];
                    if(b.qsid == s._id){
                        b.store = s;
                        break;
                    }
                }
            }
            res.send(battles);
        });
    });
});

//我的挑战
router.post('/new', function(req, res){
    console.log('new battles....');
    var user = req.session.user;
    Battle.find({
        status : 'N',
        sid : user.sid
    }, function(err, battles){
        res.send(util.toJSON(battles));
    });
});

//获取某题集下的正在进行的挑战
router.post('/qstore', function(req, res){
    var query = url.parse(req.url, true).query;
    var qsid = query.qsid;
    var skip = query.skip || 0;
    var limit = query.limit || 5;
    console.log(query);
    Battle.find({
        qsid : qsid,
        status : 'I'
    }).skip(skip).limit(limit).exec(function(err, battles){
        console.log(battles);

        res.send(util.toJSON(battles));
    });
});

router.post('/getWarzoneData', function (res, req) {
    var query = url.parse(req.url, true).query;
    var qsid = query.qsid;
    var skip = query.skip || 0;
    var limit = query.limit || 5;
    var battleData = BattleIo.battleData;
    var qsData = battleData[qsid];
    var timer = 0;
    var data = [];
    for(var p in qsData){
        var bData = {};
        bData[p] = [];
        if(timer == skip && timer < limit){
            for(var attr in qsData[p]){
                bData[p].push(attr);
            }
        }
        data.push(bData);
        if(timer >= limit){
            break;
        }
        timer++;
    }
    res.send(data);
})

//战场
router.get('/battle/:qs_id', function(req, res){
    /*console.log('战场');
    //1.拿到题集编号
    var qs_id = req.params.qs_id;
    //2.通过题集编号去获取试卷号:然后随机一套试卷
    var paperId = parseInt(Math.random() * parseInt(Setting.get('paperNum'))); //试卷ID
    var path = questionStoreDir + qs_id + '\\' + paperId + '.json';
    var data=fs.readFileSync(path, "utf-8");
    console.log(data);
    res.render('drillwar', {
        users: [req.session.user],
        qStore: JSON.parse(data) //题目
    });*/
    res.render('battle');
});


//练兵场
router.get('/drillwar/:qs_id', function(req, res){
    //1.拿到题集编号
    var qs_id = req.params.qs_id;
    //2.通过题集编号去获取试卷号:然后随机一套试卷
    var paperId = parseInt(Math.random() * parseInt(Setting.get('paperNum'))); //试卷ID
    var path = questionStoreDir + qs_id + '\\' + paperId + '.json';
    var questionData = fs.readFileSync(path, "utf-8");
    console.log(questionData);

    QuestionStore.findById(qs_id, function (err, questionStoreData) {
        if(err) throw err;
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
                        name: req.session.user.name,
                        qsid: qs_id,
                        qtitle: questionStoreData.get('title'),
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


module.exports = router;
