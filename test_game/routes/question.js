var express = require('express');
var mongoose = require('mongoose');
var url = require('url');
var mongoose = require('mongoose');

require('../models/questioncategory.js');
require('../models/questionstore.js');

var router = express.Router();
var QuestionCategory = mongoose.model('QuestionCategory');
var QuestionStore = mongoose.model('QuestionStore');

//显示题目树结构
router.post('/category', function(req, res) {
    var pid = req.body.qcid;
    if(!pid){
        pid = '0';
    }
    console.log('pid:' + pid);
    mongoose.model('QuestionCategory').find({
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

module.exports = router;
