var mongodb = require('./db.js');

function Question(cfg){
    this.qid = cfg.qid;
    this.qsid = cfg.qsid;
    this.title = cfg.title;

    //选项
    this.options = cfg.options;

    //答案
    this.answer = cfg.answer;

    //分数
    this.score = cfg.score;
}

Question.get = function get(qid, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }
        db.collection('question', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({qid : qid}, function(err, doc){
                mongodb.close();
                if(doc){
                    var q = new Question(doc);
                    callback(err, q);
                }else {
                    callback(err, null);
                }
            });
        });
    });
};

module.exports = Question;
