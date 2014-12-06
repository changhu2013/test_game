var mongodb = require('./db.js');

function Category(cfg){
    this.cid = cfg.cid;
    this.pid = cfg.pid;
    this.title = cfg.title;
}

Category.get = function get(cid, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('categorys', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({cid : cid}, function(err, doc){
                mongodb.close();
                if(doc){
                    var user = new Category(doc);
                    callback(err, user);
                }else {
                    callback(err, null);
                }
            });
        });
    });
};

module.exports = Category;
