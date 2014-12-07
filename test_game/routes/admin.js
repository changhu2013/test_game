/*
 *  后台管理页面，进行系统设置和用户信息，题目信息的导入
 */

var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var querystring = require('querystring');
var path = require('path');
var fs = require('fs');

//上传相关的中间键
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

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
    console.log('admin settings')
    res.render('settings');
});

router.post('/settings', function(req, res){
    console.log('save settings');
    //保存设置信息
    res.redirect('/admin#/settings');
});

router.get('/importusers', function(req, res){
    res.render('import_users');
});

router.post('/importusers', multipartMiddleware, function(req, res){
    console.log('import users');
    var temp_path = req.files.file.path;
    if (temp_path) {
        fs.readFile(temp_path, 'utf-8', function(err, content) {
            var users = content.split('\r\n');
            var User = mongoose.model('User');
            for(var i= 1,len=users.length;i<len;i++){
                var userArr = users[i].split(',');
                var user = new User();
                user.sid = userArr[0];
                user.name = userArr[1];
                user.job = userArr[2];
                user.save(function (err) {
                    if(err) throw err;
                });
            }
            console.log('上传成功');

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
    var qic = req.body.qic;
    var drillScore = req.body.drillScore;
    var battleScore = req.body.battleScore;

    console.log('import questions');
    //TODO : 实现读取文件内容将题目信息存入数据库
    var temp_path = req.files.file.path;
    if (temp_path) {
        fs.readFile(temp_path, 'utf-8', function(err, content) {
            var content = JSON.parse(content);
            var Question = mongoose.model('Question');
            for(var i= 0,len=content.length;i<len;i++){
                var question = new Question(content[0]);
                question.save(function (err) {
                    if(err) throw err;
                });
            }

            var QuestionStore = mongoose.model('QuestionStore');
            var qs = new QuestionStore(req.body);
            qs.save(function (err) {
                if(err) throw err;
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
