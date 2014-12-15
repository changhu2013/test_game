var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var mongoose = require('mongoose');

var Setting = require('../models/setting.js');
var BattleIo = require('../models/BattleIo.js')


require('../models/questioncategory.js');
require('../models/questionstore.js');
require('../models/question.js');

var router = express.Router();

var QuestionCategory = mongoose.model('QuestionCategory');
var QuestionStore = mongoose.model('QuestionStore');
var Question = mongoose.model('Question');

//显示题目树结构
router.post('/category', function(req, res) {
    var pid = req.body.qcid;
    if(!pid){
        pid = '0';
    }
    console.log('pid:' + pid);
    QuestionCategory.find({
        pid: pid
    }, function (err, data) {
        res.send(data);
    });
});

//获取某类型题目集
router.post('/store', function(req, res){
    var query = url.parse(req.url, true).query,
        qcid = query.qcid,
        skip = query.skip || 0,
        limit = query.limit || 10;
    console.log(query);
    QuestionStore.find({
        qcid:qcid
    }).skip(skip).limit(limit).exec(function(err, stores){
        res.send(stores);
    });
});

//校验答案,返回答案的正确,还有自己和其他队友的信息(进度),
// 自己的拖后腿的道具数量,自己连续答对题目的数量
router.post('/valianswer', function (req, res) {
    console.log('校验答案');
    var _id = req.query._id;
    var answer = req.query.answer;
    var bid = req.query.bid; //战场ID
    var sid = req.session.user.sid;
    var qsId = req.query.qs_id;
    Question.findById(_id, function(err, data){
        var userBattleData = BattleIo.getBattleMsg(qsId, bid, sid);
        var result = {}; //结果
        if(data && data.get('answer') == answer){ //答对
            //userBattleData.validity.push(_id); //更新答对题目ID
            //userBattleData.progress = userInfo.validity.length / parseInt(Setting.get('battleQuestionNum')); //进度
            BattleIo.battleValidaty(qsId, bid, sid, _id);
            BattleIo.battleProgress(qsId, bid, sid, BattleIo.battleValidaty(qsId, bid, sid).length / parseInt(Setting.get('battleQuestionNum')));
            BattleIo.battleSerialValidity(qsId, bid, sid, BattleIo.battleSerialValidity(qsId, bid, sid) + 1);
            result['success'] = true;
        } else {
            BattleIo.battleSerialValidity(qsId, bid, sid, 0);
            BattleIo.battleMistake(qsId, bid, sid, _id);
            result['success'] = false;
        }

        if((BattleIo.battleMistake(qsId, bid, sid).length + BattleIo.battleValidaty(qsId, bid, sid).length) == parseInt(Setting.get('battleQuestionNum'))){
            BattleIo.battleStatus(qsId, bid, sid, 'C');
        }
        result['battleData'] = BattleIo.getBattleMsg(qsId, bid, sid);
        res.send(result);
    })
});


//中途退出战场(包括练习场)或者逃跑
//需要判断当前战场是否还有其他人
router.post('/gooutbattle', function(req, res){
    var questionBattleData = global.questionBattleData;
    var bid = req.query.bid;
    var bidData= questionBattleData[bid];
    var usersData = bidData['users'];
    if(usersData.length == 1){ //战场只剩自己
        Battle.findByIdAndUpdate(bid, {
            status: 'E',
            end: new Date()
        },{}, function (err) {
            if(err) throw err;
            delete questionBattleData[bid]; //删除该战场所有信息
        })
    } else { //战场还有其他人
        usersData[req.session.user.sid]['statu'] = 'E';//跑路
    }
    res.send(true);
});


module.exports = router;
