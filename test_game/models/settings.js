var mongodb = require('./db.js');

function Settings(cfg){

    this.timeScorePct = cfg.timeScorePct;

    this.userScorePct = cfg.userScorePct;

    this.succScorePct = cfg.succScorePct;

    this.maxUserNum = cfg.maxUserNum;

    this.minUserNum = cfg.minUserNum;

    this.userSuccPct = cfg.userSuccPct;

    this.battleQuestionNum = cfg.battleQuestionNum;
}

Settings.prototype.save = function(callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('settings', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var data = {
                timeScorePct : this.timeScorePct,
                userScorePct : this.userScorePct,
                succScorePct : this.succScorePct,
                maxUserNum : this.maxUserNum,
                minUserNum : this.minUserNum,
                userSuccPct : this.userSuccPct,
                battleQuestionNum : this.battleQuestionNum
            };
            collection.insert(data, function(err, doc){
                mongodb.close();
                callback(err);
            });
        });
    });
};

Settings.get = function(callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('settings', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne(function(err, doc){
                mongodb.close();
                if(doc){
                    var settings = new Settings(doc);
                    callback(err, settings);
                }else {
                    callback(err, null);
                }
            });
        });
    });
};

module.exports = Settings;