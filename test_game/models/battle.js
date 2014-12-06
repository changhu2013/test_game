var mongodb = require('./db.js');

function Battle(cfg){

    this.bid = cfg.bid;

    //接收挑战的人的ID
    this.sid = cfg.sid;

    //题集ID
    this.qsid = cfg.qsid;

    //开始时间
    this.start = cfg.start;

    //结束时间
    this.end = cfg.end;

    //练习得分
    this.drillScore = cfg.drillScore;

    //挑战得分
    this.battleScore = cfg.battleScore;

    //对手信息
    this.rivals = cfg.rivals;

    //挑战者,即发起挑战的人
    this.challenger = cfg.challenger;
}

module.exports = Battle;
