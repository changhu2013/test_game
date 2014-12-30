/**
 * 记录用于在某题集(战区)的挑战记录，即该用户在该战区的最高挑战积分，最近一次挑战时间
 * @type {*|exports}
 */
require('./questionstore.js');
var util = require('./util.js');

var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var QuestionStore =  mongoose.model('QuestionStore');
var Mixed = mongoose.Schema.Types.Mixed;

var StoreBattle = new Schema({
    qsid : String, //题集ID
    qtitle: String, //题集名
    sid : String,  //用户ID
    name: String, //用户名
    bid : String,  //挑战ID
    maxBattleScore : Number, // 该题集下挑战的最高积分
    maxDrillScore : Number,  // 该题集下练习的最高积分
    costTime: Number, //花费时间
    lastTime : Date //最近一次挑战时间
});

mongoose.model('StoreBattle', StoreBattle, 'storebattles');
