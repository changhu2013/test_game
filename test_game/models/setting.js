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

    //每个挑战题目数量
    battleQuestionNum : Number
});

mongoose.model('Setting', Setting, 'setting');
