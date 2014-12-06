var mongodb = require('./db.js');

function Record(cfg){
    this.rid = cfg.rid;
    this.sid = cfg.sid;

    this.qsid = cfg.qsid;

    this.wid = cfg.wid;

    //开始时间
    this.start = cfg.start;

    //结束时间
    this.end = cfg.end;

    //练习积分
    this.drillScore = cfg.drillScore;

    //挑战积分
    this.battleScore = cfg.battleScore;
}

Record.get = function get(rid, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('records', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({rid : rid}, function(err, doc){
                mongodb.close();
                if(doc){
                    var record = new Record(doc);
                    callback(err, record);
                }else {
                    callback(err, null);
                }
            });
        });
    });
};

module.exports = Record;
