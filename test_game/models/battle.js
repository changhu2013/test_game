var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var Mixed = mongoose.Schema.Types.Mixed;
var Battle = new Schema({

    //接收挑战的人的ID
    sid : String,
    sname : String,//应战这名称

    //挑战状态：N - 未开始 F - 已经完成 I - 正在进行中 E-跑路(所有人跑路)
    status : String,

    //题集ID
    qsid : String,
    qstitle : String, //挑战题集名称

    //开始时间
    start : Date,

    //结束时间
    end : Date,

    //练习得分
    drillScore : Number,

    //挑战得分
    battleScore : Number,

    //对手信息
    rivals : Mixed,

    //挑战者,即发起挑战的人{sid : 1, name:'XXXX'}
    challenger : Mixed,

    challengeTime : Date //挑战时间
});

mongoose.model('Battle', Battle, 'battles');
