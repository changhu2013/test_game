var mongodb = require('./db.js');

function User(cfg){
    this.sid = cfg.sid;
    this.name = cfg.name;
    //职位
    this.job = cfg.job;
    //积分
    this.score = cfg.score;
    //挑战次数
    this.battles = cfg.battles;
}

User.get = function get(sid, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({sid : sid}, function(err, doc){
                mongodb.close();
                if(doc){
                    var user = new User(doc);
                    callback(err, user);
                }else {
                    callback(err, null);
                }
            });
        });
    });
};

module.exports = User;
