var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var url = require('url');
var mongoose = require('mongoose');

var Setting = require('../models/setting.js');
var BattleIo = require('../models/BattleIo.js')
var Command = require('../public/command.js');


require('../models/questioncategory.js');
require('../models/questionstore.js');
require('../models/question.js');

var router = express.Router();

var QuestionCategory = mongoose.model('QuestionCategory');
var QuestionStore = mongoose.model('QuestionStore');
var Question = mongoose.model('Question');
var Battle = mongoose.model('Battle');
var StoreBattle = mongoose.model('StoreBattle');

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
            BattleIo.battleValidaty(qsId, bid, sid, _id);
            BattleIo.battleProgress(qsId, bid, sid, BattleIo.battleValidaty(qsId, bid, sid).length / parseInt(Setting.get('battleQuestionNum')));
            var no = BattleIo.battleSerialValidity(qsId, bid, sid) + 1;
            BattleIo.battleSerialValidity(qsId, bid, sid, no);
            result['success'] = true;
        } else {
            BattleIo.battleSerialValidity(qsId, bid, sid, 0);
            BattleIo.battleMistake(qsId, bid, sid, _id);
            result['success'] = false;
        }

        if((BattleIo.battleMistake(qsId, bid, sid).length + BattleIo.battleValidaty(qsId, bid, sid).length) == parseInt(Setting.get('battleQuestionNum'))){ //此时挑战结束
            BattleIo.getBattleMsg(qsId, bid, sid)['end'] = new Date();
            BattleIo.battleStatus(qsId, bid, sid, 'C'); //战斗结束
        }

        var battleData = BattleIo.getBattleMsg(qsId, bid);
        var isBattleEnd = true;
        for(var p in battleData){
            var user = battleData[p];
            if(user.status != 'C'){
                isBattleEnd = false;
                break;
            }
        }

        if(isBattleEnd){ //战斗结束(所有人都结束)
            QuestionStore.findById(qsId, function (err, data) {
                var maxTime = data.get('maxTime'); //最大挑战时间
                Battle.findById(bid, function (err, data) {
                    var userNum = 0; //参数人数
                    var usersId = [];
                    for(var p in battleData){
                        userNum++;
                        usersId.push(p);
                    }

                    var userGradeData = []; //计算成绩的数据

                    for(var p in battleData){
                        var user = battleData[p]; //每个人
                        var grade = 0; //分数
                        var obj = {};
                        var when = user.end - user.start;

                        if(user.progress >= 0.6){ //挑战成功
                            grade += 100 *  parseFloat(Setting.get('succScorePct')) * BattleIo.battleValidaty(qsId, bid, user.sid).length /parseInt(Setting.get('battleQuestionNum'));
                            user['grade'] = grade;
                            obj['sid'] = user.sid;
                            obj['grade'] = grade;
                            obj['when'] = when;
                            userGradeData.push(obj);
                        } else {
                            continue;
                        }

                        if(when < (maxTime * 1000)) {
                            grade += 100 * parseFloat(Setting.get('timeScorePct'));
                        }
                        grade +=  100 * parseFloat(Setting.get('userScorePct')) * userNum / parseInt(Setting.get('battleMaxUserNum'));
                        user['grade'] = grade;
                        obj['sid'] = user.sid;
                        obj['grade'] = grade;
                        obj['when'] = when;
                        userGradeData.push(obj);
                    }

                    var succUser = Math.floor(userNum * Setting.get('userSuccPct'));
                    function compare(propertyName1, propertyName2) {
                        return function (object1, object2) {
                            var value1 = object1[propertyName1];
                            var value2 = object2[propertyName1];
                            if (value2 < value1) {
                                return -1;
                            }
                            else if (value2 > value1) {
                                return 1;
                            }
                            else {
                                if (object1[propertyName2] < object1[propertyName1]) {
                                    return 1;
                                }
                                else if (object1[propertyName2] > object1[propertyName1]) {
                                    return -1;
                                }
                                else {
                                    return 0;
                                }
                            }
                        }
                    }
                    userGradeData = userGradeData.sort(compare("grade", 'when')); //按照分数排序
                    for(var i= 0;i<succUser;i++){
                        var userId = userGradeData[i]['sid'];
                        battleData[userId]['battsucc'] = true;
                        battleData[userId]['index'] = (i + 1);
                    }

                    result['battleData'] = battleData;
                    result['currentMaxGrade'] = userGradeData[0]['grade'];

                    //查询历史记录
                    StoreBattle.where({'qsid': qsId}).sort({
                        maxBattleScore: 'desc'
                    }).limit(1).exec(function (err, data) {
                        if(err) throw  err;
                        result['historyRecord'] = {
                            grade : data[0].get('maxBattleScore') || 0,
                            creater: data[0].get('name')
                        }

                        async.eachSeries(usersId, function (item, callback) {
                            if(item === data[0].get('sid') && (battleData[item]['grade'] < data[0].get('maxBattleScore'))){
                                return;
                            }
                            StoreBattle.update({
                                sid: item,
                                qsid: qsId
                            }, {
                                maxBattleScore: battleData[item]['grade'] || 0
                            }, function (err, data) {
                                console.log("战斗结束,广播:BATTLE_OK");
                                //向战场发通知
                                BattleIo.broadcast(sid, 'battle-' + qsId + '-' + bid, Command.BATTLE_OK, result)
                                //向题集发通知
                                BattleIo.broadcast(sid, 'battle-' + qsId, Command.BATTLE_OK, BattleIo.getBattleMsg(qsId));
                                res.send(result);
                            });
                        }, function (err) {
                            if(err) throw err;
                        });

                    });
                })
            });
        } else {
            result['battleData'] = battleData[sid];
            res.send(result);
        }

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
        usersData[req.session.user.sid]['status'] = 'E';//跑路
    }
    res.send(true);
});


module.exports = router;
