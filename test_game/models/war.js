var mongodb = require('./db.js');

function War(cfg){
    this.wid = cfg.wid;
    this.qsid = cfg.qsid;

    this.start = cfg.start;

    this.end = cfg.end;

    this.users = cfg.users;
}

War.get = function get(wid, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('wars', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({wid : wid}, function(err, doc){
                mongodb.close();
                if(doc){
                    var war = new War(doc);
                    callback(err, war);
                }else {
                    callback(err, null);
                }
            });
        });
    });
};

module.exports = War;
