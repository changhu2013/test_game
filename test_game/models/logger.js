var mongodb = require('./db.js');

function Logger(){
}

//记录登录日志
Logger.login = function get(user, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('logs', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var log = {
                time : (new Date()).getTime(),
                sid : user.sid,
                name : user.name,
                type : 'login'
            };
            collection.insert(log, {safe:true}, function(err, result){
                mongodb.close();
                callback(err, result);
            });
        });
    });
};

//记录登出日志
Logger.logout = function get(user, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('logs', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var log = {
                time : (new Date()).getTime(),
                sid : user.sid,
                name : user.name,
                type : 'logout'
            };
            collection.insert(log, {safe:true}, function(err, result){
                mongodb.close();
                callback(err, result);
            });
        });
    });
};

module.exports = Logger;
