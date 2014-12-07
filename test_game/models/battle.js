var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var Battle = new Schema({
    bid : String,

    //接收挑战的人的ID
    sid : String,

    //题集ID
    qsid : String,

    //开始时间
    start : Date,

    //结束时间
    end : Date,

    //练习得分
    drillScore : Number,

    //挑战得分
    battleScore : Number,

    //对手信息
    rivals : String,

    //挑战者,即发起挑战的人
    challenger : String
});

mongoose.model('Battle', Battle, 'battles');
