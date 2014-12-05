var mongodb = require('./db.js');
var logger = require('./logger.js');

function User(user){
    this.sid = user.sid;
    this.name = user.name;
    this.job = user.job;
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
