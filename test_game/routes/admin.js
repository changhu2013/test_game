/*
 *  后台管理页面，进行系统设置和用户信息，题目信息的导入
 */

var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

var fileutil = require('../models/fileutil');
var Setting = require('../models/setting.js');

//上传相关的中间键
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


var createPaperNum = 20; //每个题集下生成多少套题目
var paperQuestionNum = 20; //每套题有多少个题

require('../models/setting.js');
require('../models/user.js');
require('../models/questionstore.js');
require('../models/question.js');

var router = express.Router();

router.get('/', function(req, res){
    console.log('admin index');
    res.render('admin');
});

router.get('/settings', function(req, res) {
    res.render('settings', {
        Setting : Setting.getData()
    });
});

router.post('/settings', function(req, res){
    console.log(req.body);
    //保存设置信息
    //时间占比
    var timeScorePct = req.body.timeScorePct;
    if(timeScorePct != undefined){
        Setting.set('timeScorePct', Number(timeScorePct));
    }

    //人数占比
    var userScorePct = req.body.userScorePct;
    if(userScorePct != undefined){
        Setting.set('userScorePct', Number(userScorePct));
    }

    //成功与否占比
    var succScorePct = req.body.succScorePct;
    if(succScorePct != undefined){
        Setting.set('succScorePct', Number(succScorePct));
    }

    //参站报名积分
    var battleEntryFee = req.body.battleEntryFee;
    if(battleEntryFee != undefined){
        Setting.set('battleEntryFee', Number(battleEntryFee));
    }

    //挑战最多人数
    var battleMaxUserNum = req.body.battleMaxUserNum;
    if(battleMaxUserNum != undefined){
        Setting.set('battleMaxUserNum', Number(battleMaxUserNum));
    }

    //挑战最少人数
    var battleMinUserNum = req.body.battleMinUserNum;
    if(battleMinUserNum != undefined){
        Setting.set('battleMinUserNum', Number(battleMinUserNum));
    }

    //成功百分比
    var userSuccPct = req.body.userSuccPct;
    if(userSuccPct != undefined){
        Setting.set('userSuccPct', Number(userSuccPct));
    }

    //每个题集下生成的试卷的数量
    var paperNum = req.body.paperNum;
    if(paperNum != undefined){
        Setting.set('paperNum', Number(paperNum));
    }

    //每个挑战题目数量
    var battleQuestionNum = req.body.battleQuestionNum;
    if(battleQuestionNum != undefined){
        Setting.set('battleQuestionNum', Number(battleQuestionNum));
    }

    res.redirect('/admin#/settings');
});

router.get('/importusers', function(req, res){
    res.render('import_users', {
        success: true,
        msg: '上传成功'
    });
});

router.post('/importusers', multipartMiddleware, function(req, res){
    console.log('import users');
    var temp_path = req.files.file.path;
    if (temp_path) {
        fs.readFile(temp_path, 'utf-8', function(err, content) {
            var users = content.split('\n');
            var User = mongoose.model('User');
            for(var i= 0,len=users.length;i<len;i++){
                var userArr = users[i].split(',');
                var user = new User();
                user.sid = userArr[0];
                user.name = userArr[1];
                user.job = userArr[2];
                user.save(function (err) {
                    if(err) throw err;
                });
            }
            // 删除临时文件
            fs.unlink(temp_path);
        });
    }
    res.redirect('/admin#/importusers');
});

router.get('/importquestions', function(req, res){
    res.render('import_questions');
});

router.post('/importquestions', multipartMiddleware, function(req, res){

    var title = req.body.title;
    var qcid = req.body.qcid;
    var drillScore = req.body.drillScore;
    var battleScore = req.body.battleScore;

    console.log('import questions');

    var temp_path = req.files.file.path;
    if (temp_path) {
        fs.readFile(temp_path, 'utf-8', function(err, content) {

            //先保存题集,并返回题集qsid
            var QuestionStore = mongoose.model('QuestionStore');
            var qs = new QuestionStore(req.body);

            var qsid = '';

            var content = JSON.parse(content);
            var Question = mongoose.model('Question');

            qs.save(function (err, questionStore, numberAffected) {
                if(err) throw err;
                qsid = questionStore.get('_id').toString();

                //题目保存
                for(var i= 0,len=content.length;i<len;i++){
                    content[i]['qsid'] = qsid;
                    var question = new Question(content[i]);
                    (function(i){
                        question.save(function (err, question, numberAffected) {
                            if(err) throw err;
                            content[i]['_id'] = question.get('_id').toString();
                            delete content[i]['answer'];
                        });
                    })(i);
                }

                var questStoreDir = 'f:\\qs'; //文件保存里面
                //根据题集生成文件夹
                questStoreDir += '\\' + qsid;
                fileutil.mkdirs(questStoreDir, 0755, function(){

                    //生成试卷
                    for(var k=0;k<createPaperNum;k++){
                        var qNo = [];
                        // 循环N次生成随机数
                        for(var i = 0 ; ; i++){
                            //生成随机数个数
                            if(qNo.length< paperQuestionNum){
                                generateRandom(content.length);
                            }else{
                                break;
                            }
                        }

                        // 生成随机数的方法
                        function generateRandom(count){
                            var rand = parseInt(Math.random()*count);
                            for(var i = 0 ; i < qNo.length; i++){
                                if(qNo[i] == rand){
                                    return false;
                                }
                            }
                            qNo.push(rand);
                        }

                        var arr = [];
                        for(var i= 0,len=content.length;i<len;i++){
                            if(qNo.indexOf(i) > -1){
                                var a = content[i];
                                arr.push(JSON.stringify(a));
                            }
                        }
                        var str = '[' + arr.join(',') + ']';
                        var fn = questStoreDir + '\\' + k + '.json';
                        fs.writeFile(fn, str, function (e) {
                            if(e) throw e;
                        });
                    }
                });

            });


            // 删除临时文件
            fs.unlink(temp_path);
        });
    }
    res.redirect('/admin#/importquestions');
});

//系统报表
router.get('/report', function(req, res){
    console.log('report index');
    //TODO : 生成报表

    res.render('report');
});

module.exports = router;
