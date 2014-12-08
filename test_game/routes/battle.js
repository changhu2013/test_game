var express = require('express');
var mongoose = require('mongoose');
var url = require('url');

require('../models/battle.js');
require('../models/questionstore.js');

var router = express.Router();
var Battle = mongoose.model('Battle');
var QuestionStore = mongoose.model('QuestionStore');

//最近参加的战区
router.post('/laststore', function(req, res) {
    console.log('查询最近参加的战区');
    var user = req.session.user;
    //分组查询最近的挑战
    Battle.aggregate({
        $match : {
            status : 'F',
            sid : user.sid
        }
    }).group({
        _id : '$qsid',
        lastTime : {$max : '$end'} //最近一次参加的时间
    }).exec(function(err, battles){
        battles = battles || [];
        var qsids = [];
        for(var k = 0; k < battles.length; k++){
            qsids.push(battles[k]._id);
        }
        console.log(qsids);
        QuestionStore.find({
            qsid : {
                $in : qsids
            }
        }, function(err, stores){
            for(var i = 0; i < battles.length; i++){
                var b = battles[i];
                for(var j = 0 ;j < stores.length; j++){
                    var s = stores[j];
                    b.store = s;
                }
            }
            console.log(battles);
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
