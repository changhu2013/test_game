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

var Settings = require('../models/settings.js');

var encoding = require('encoding');// 解决乱码
var router = express.Router();

router.get('/', function(req, res){
    console.log('admin index');
    res.render('admin');
});

router.get('/settings', function(req, res) {
    console.log(Settings);
    Settings.get(function(err, settings){

        console.log(settings);

        res.render('settings', settings);
    });
});

router.post('/settings', function(req, res){
    console.log('save settings');
    //保存设置信息

    res.redirect('/admin#/settings');
})

router.get('/importusers', function(req, res){
    res.render('import_users');
});

router.post('/importusers', multipartMiddleware, function(req, res){
    console.log('import users');
    req.setEncoding('utf-8');//请求编码
    //TODO : 实现读取文件内容将用户信息存入数据库
    var temp_path = req.files.file.path;
    if (temp_path) {
        fs.readFile(temp_path, 'utf-8', function(err, content) {

            console.log(encoding.convert(content, 'gb2312'));

            var users = content.split('\r\n');
            for(var i= 1,len=users.length;i<len;i++){
                var userArr = users[i].split(',');
                var User = mongoose.model('user');
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

router.post('/importquestions', function(req, res){
    console.log('import questions');
    //TODO : 实现读取文件内容将题目信息存入数据库

    res.redirect('/admin#/importquestions');
});

//系统报表
router.get('/report', function(req, res){
    console.log('report index');
    //TODO : 生成报表
    
    res.render('report');
});

module.exports = router;
