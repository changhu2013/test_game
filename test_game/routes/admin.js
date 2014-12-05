

/*
 *  后台管理页面，进行系统设置和用户信息，题目信息的导入
 */

var express = require('express');
var url = require('url');
var querystring = require('querystring');

var router = express.Router();

router.get('/', function(req, res){
    console.log('admin index');
    res.render('admin');
});

router.get('/settings', function(req, res) {
    res.render('settings');
});

router.post('/settings', function(req, res){
    console.log('save settings');
    //保存设置信息

    res.redirect('/admin#/settings');
})

router.get('/importusers', function(req, res){
    res.render('import_users');
});

router.post('/importusers', function(req, res){
    
    console.log('import users');
    //TODO : 实现读取文件内容将用户信息存入数据库

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
