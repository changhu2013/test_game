var config = require('./config');
var mongoose = require('mongoose');
var moment = require('moment');


var util = require('./models/util.js');
var Setting = require('./models/setting.js');

//mongoose
var url = 'mongodb://' + config.host + '/' + config.db;
mongoose.connect(url, {
  user : config.user,
  pass : config.pwd
});

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

User.find().exec(function(err, users){
 console.log(users);
});


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

//var a = util.dateFormat(new Date());
//console.log(a);

/*
Setting.set('timeScorePct', 0.2);
Setting.set('userScorePct', 0.3);
Setting.set('succScorePct', 0.4);

Setting.set('battleMaxUserNum', 5);
Setting.set('battleMinUserNum', 2);
Setting.set('userSuccPct', 0.6);
Setting.set('battleEntryFee', 5);
Setting.set('paperNum', 200);
Setting.set('battleQuestionNum', 20);

console.log(Setting.data);
*/
/*
var Command = require('./public/command.js');

//console.log(Command);

var now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
console.log(now);

*/

//更新用户积分为1000
/*
User.update({
 sid : '1001'
}, {
 score : 1000
}).exec(function(err, doc){
 console.log(doc);
});
*/
/*
User.findOne({
 sid : '1001'
}).exec(function(err, user){
console.log(user.name);
});
*/

/*
Battle.update({
 _id : '54a0bab3c3c4a3a418557680'
}, {
 end : new Date()
}).exec(function(){

 Battle.find({
  _id : '54a0bab3c3c4a3a418557680'
 }).exec(function(err, b){
  console.log(b);
 })
});

*/
