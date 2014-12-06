var express = require('express');
var url = require('url');
var querystring = require('querystring');

var router = express.Router();

//显示题目树结构
router.post('/tree', function(req, res) {
    var data = [{
        id : '0',
        text : 'A ',
        nodes : [{
            id : '1',
            text : 'A1'
        }, {
            id : '2',
            text : 'A2'
        }, {
            id : '3',
            text : 'A3'
        }]
    }];    
    res.send(data);
});


//显示题目
router.post('/leaf', function(req, res){
    var query = url.parse(req.url, true).query;
    console.log(query);
    if(query && query.id){
        var data = [{
            title : 'AAAA题目集 ' + query.id,
            challenge : 25,
            training : 2,
            users : 16
        }, {
            title : 'BBBB题目集',
            challenge : 25,
            training : 2,
            users : 14
        }];
        res.send(data)
    }
});


module.exports = router;
