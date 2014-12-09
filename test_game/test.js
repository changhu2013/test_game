var settings = require('./settings');
var mongoose = require('mongoose');
var moment = require('moment');
var util = require('./models/util.js');

//mongoose
mongoose.connect('mongodb://' + settings.host + '/' + settings.db);

require('./models/user.js');
require('./models/questioncategory.js');
require('./models/questionstore.js');
require('./models/question.js');
require('./models/battle.js');
require('./models/storebattle.js');

var StoreBattle = mongoose.model('StoreBattle');
var User = mongoose.model('User');
var QuestionCategory = mongoose.model('QuestionCategory');
var QuestionStore = mongoose.model('QuestionStore');
var Question = mongoose.model('Question');
var Battle = mongoose.model('Battle');

//过滤查询
/*
 var query = Battle.distinct('qsid', {
 status : 'F',
 sid : '1'
 });

 query.exec(function (err, result) {
 console.log(result);
 });
 */

/*
 Battle.aggregate({
 $match : {
 status : 'F',
 sid : '1'
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
 console.log(stores);
 for(var i = 0; i < battles.length; i++){
 var b = battles[i];
 for(var j = 0 ;j < stores.length; j++){
 var s = stores[j];
 b.store = s;
 }
 }
 console.log(battles);
 });
 });

 */
/*
 User.find().limit(10).sort({
 score : 'desc'
 }).exec(function(err, users){
 for(var i in users){
 console.log(users[i].sid);
 }
 });

 */

//生成测试记录
/*
 for(var i = 0 ; i < 12; i++){
 var sb = new StoreBattle({
 qsid : '' + i,
 sid : '1',
 bid : '' + i,
 maxBattleScore : i * i,
 maxDrillScore : i + 122,
 lastTime : new Date(2014, i, 1)
 });
 sb.save(function (err) {
 if(err) throw err;
 });
 }
 */
/*
 StoreBattle.find({
 sid : '1'
 }, function(err, battles){
 battles = battles || [];
 var qsids = [];
 for(var k = 0; k < battles.length; k++){
 var b = battles[k];
 qsids.push(b.qsid);
 }
 console.log(qsids);
 QuestionStore.find({
 qsid : {
 $in : qsids
 }
 }, function(err, stores){
 var a = [];
 for(var i = 0; i < battles.length; i++){
 var b = battles[i];
 console.log('---- ' + dateFormat(b.lastTime, 'yyyy-mm-dd, hh:MM:ss'));
 b.lastTime = dateFormat(b.lastTime, 'yyyy-mm-dd, hh:MM:ss');
 for(var j = 0 ;j < stores.length; j++){
 var s = stores[j];
 if(b.qsid == s.qsid){
 console.log('---------------------------2222');
 b.store = s;
 break;
 }
 }
 a.push(b);
 }
 console.log(battles);
 console.log('---------------------------');
 console.log(a);
 });
 });
 */

StoreBattle.find({
    qsid : '1'
}, function(err, battles){
    var json = util.toJSON(battles);
    console.log(json);
});

//var a = util.dateFormat(new Date());
//console.log(a);
