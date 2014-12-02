var  mongodb = require('mongodb');
var  server  = new mongodb.Server('localhost', 27017, {auto_reconnect:true});
var  db = new mongodb.Db('mydb', server, {safe:true});

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('honor');
});

/* 荣誉榜 */
router.post('/list', function(req, res) {
  var data = [{
    name: '张三',
    gameTime: 23,
    score: 56
  }, {
    name: '李四',
    gameTime: 13,
    score: 34
  }, {
    name: '王五',
    gameTime: 33,
    score: 76
  }];
  res.send(data);
});

module.exports = router;
