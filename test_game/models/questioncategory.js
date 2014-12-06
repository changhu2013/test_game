var mongodb = require('./db.js');

function QuestionCategory(cfg){
    //分类ID
    this.qcid = cfg.qcid;
    //父项ID
    this.pid = cfg.pid;
    //题目
    this.title = cfg.title;
}

module.exports = QuestionCategory;
