var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var util = require('../models/util.js');

require('../models/battle.js');
require('../models/questionstore.js');
require('../models/storebattle.js');

var router = express.Router();
var Battle = mongoose.model('Battle');
var QuestionStore = mongoose.model('QuestionStore');
var StoreBattle = mongoose.model('StoreBattle');

//最近参加的战区
router.post('/laststore', function(req, res) {
    var query = url.parse(req.url, true).query,
        skip = query.skip || 0,
        limit = query.limit || 10;

    console.log(query);
    var user = req.session.user;
    StoreBattle.find({
        sid : user.sid
    }).sort({
        lastTime : -1
    }).skip(skip).limit(limit).exec(function(err, battles){
        battles = util.toJSON(battles);
        var qsids = [];
        for(var k = 0; k < battles.length; k++){
            qsids.push(battles[k].qsid);
        }
        QuestionStore.find({
            qsid : {
                $in : qsids
            }
        }, function(err, stores){
            stores = util.toJSON(stores);
            for(var i = 0; i < battles.length; i++){
                var b = battles[i];
                for(var j = 0 ;j < stores.length; j++){
                    var s = stores[j];
                    if(b.qsid == s.qsid){
                        b.store = s;
                        break;
                    }
                }
            }
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
