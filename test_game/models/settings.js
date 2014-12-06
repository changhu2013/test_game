var mongodb = require('./db.js');

function Settings(cfg){

    this.timeScorePct = cfg.timeScorePct;

    this.userScorePct = cfg.userScorePct;

    this.succScorePct = cfg.succScorePct;

    this.maxUserNum = cfg.maxUserNum;

    this.minUserNum = cfg.minUserNum;

    this.userSuccPct = userSuccPct;

    this.battleQuestionNum = cfg.battleQuestionNum;
}

module.exports = new Settings({
    
});