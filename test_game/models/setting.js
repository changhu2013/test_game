/*
 var mongoose = require('mongoose')
 , Schema = mongoose.Schema
 , ObjectId = Schema.ObjectId;

 var Setting = new Schema({

 //时间占比
 timeScorePct : Number,

 //人数占比
 userScorePct : Number,

 //成功与否占比
 succScorePct : Number,

 //跳帧最多人数
 maxUserNum : Number,

 //挑战最少人数
 minUserNum : Number,

 //成功百分比
 userSuccPct : Number,

 //每个题集下生成的试卷的数量
 paperNum: Number,

 //每个挑战题目数量
 battleQuestionNum : Number
 });

 mongoose.model('Setting', Setting, 'setting');
 */

var fs = require('fs');

var Setting = function (data) {
    console.log(data);
    this.data = data ;
};

var file =  __dirname + '\\config.json';
fs.openSync(file, 'a');

var doInit = function(){
    var str = fs.readFileSync(file, 'UTF-8');
    console.log(str);
    return JSON.parse(str);
};

var doSave = function (data) {
    var str = JSON.stringify(data);
    fs.writeFileSync(file, str, 'UTF-8');
};

Setting.prototype.init = function(){
    this.data = doInit();
};

Setting.prototype.save = function(){
    doSave(this.data);
};

Setting.prototype.set = function(key, value){
    this.data[key] = value;
    this.save();
};

Setting.prototype.get = function(key){
    return this.data[key];
};

module.exports = new Setting(doInit());
