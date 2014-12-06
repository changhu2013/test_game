var mongodb = require('./db.js');

function QuestionStore(cfg){

    //题集ID
    this.qsid = cfg.qsid;

    //分类
    this.cid = cfg.cid;

    //说明
    this.title = cfg.title;

    //练习积分
    this.drillScore = cfg.drillScore;

    //挑战积分
    this.battleScore = cfg.battleScore;

    //最大挑战时长
    this.maxTime = cfg.maxTime;

    //悬赏分
    this.bounty = cfg.bounty;

    //随即题目集
    this.papers = cfg.papers;
};

module.exports = QuestionStore;
