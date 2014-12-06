var express = require('express');
var url = require('url');
var querystring = require('querystring');

var User = require('../models/user.js');
var Logger = require('../models/logger.js');

var router = express.Router();
router.get('/', function(req, res) {
    //判断是否登录
    if(req.session && req.session.user){
        res.render('index', {user : req.session.user});
    }else {
        var query = url.parse(req.url, true).query;
        var sid = query.sid;
        if(sid == undefined){
            req.flash('success', '错误的sid');
            res.render('index', {user : null});
        }else {
            User.get(sid, function(err, user){
                if(err){
                    req.flash('success', '未找到sid:' + sid + '的用户');
                    res.render('index');
                }else {
                    req.flash('success', '登陆成功');
                    req.session.user = user;
                    Logger.login(user, function(){
                        res.render('index', {user : user});
                    });
                }
            });
        }
    }
});

module.exports = router;
