var mongodb = require('./db.js');

function Questions(cfg){
    this.qsid = cfg.qsid;
    this.cid = cfg.cid;
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
}

Questions.get = function get(qsid, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('questions', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({qsid : qsid}, function(err, doc){
                mongodb.close();
                if(doc){
                    var qs = new Questions(doc);
                    callback(err, qs);
                }else {
                    callback(err, null);
                }
            });
        });
    });
};

module.exports = Questions;
