var express = require('express');
var mongoose = require('mongoose');
var url = require('url');

require('../models/Battle.js');

var router = express.Router();
var Battle = mongoose.model('Battle');

//最近挑战
router.post('/finished', function(req, res) {
    console.log('last battles....');
    var user = req.session.user;
    Battle.find({
        status : 'F',
        sid : user.sid
    }, function(err, battles){
        res.send(battles);
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
        res.send(battles);
    });
});

//获取某题集下的正在进行的挑战
router.post('/qstore', function(req, res){
    var query = url.parse(req.url, true).query;
    var qsid = query.qsid;
    console.log('qsid:' + qsid);
    Battle.find({
        qsid : qsid,
        status : 'I'
    }, function(err, battles){
        res.send(battles);
    });
});

module.exports = router;
