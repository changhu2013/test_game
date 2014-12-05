var express = require('express');
var url = require('url');
var querystring = require('querystring');

var User = require('../models/user.js');

var router = express.Router();
router.get('/', function(req, res) {
    var query = url.parse(req.url, true).query;
    if(query && query.sid){
        req.flash('success', '登陆成功');
        //测试用户
        req.session.user = new User({
            sid : query.sid,
            name : '张三'
        });
        res.render('index');
    }else {
        res.redirect('/error');
    }
});



module.exports = router;
