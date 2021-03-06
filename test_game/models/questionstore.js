
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var QuestionStore = new Schema({
    qcid : String,
    title : String,
    onLineUserNum: Number, //在线用户数
    drillScore : Number, //练习积分
    battleScore : Number, //挑战积分
    maxTime : Number, // 最大挑战时间
    bounty : Number, // 悬赏分
    papers : String  //随机生成在服务器上对应的文件名
});

mongoose.model('QuestionStore', QuestionStore, 'questionstores');