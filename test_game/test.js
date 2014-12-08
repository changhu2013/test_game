var settings = require('./settings');
var mongoose = require('mongoose');
//mongoose
mongoose.connect('mongodb://' + settings.host + '/' + settings.db);

require('./models/user.js');
require('./models/questioncategory.js');
require('./models/questionstore.js');
require('./models/question.js');
require('./models/battle.js');


var User = mongoose.model('User');
var QuestionCategory = mongoose.model('QuestionCategory');
var QuestionStore = mongoose.model('QuestionStore');
var Question = mongoose.model('Question');
var Battle = mongoose.model('Battle');

//过滤查询
/*
var query = Battle.distinct('qsid', {
    status : 'F',
    sid : '1'
});

query.exec(function (err, result) {
    console.log(result);
});
*/

Battle.aggregate({
    $match : {
        status : 'F',
        sid : '1'
    }
}).group({
    _id : '$qsid',
    lastTime : {$max : '$end'} //最近一次参加的时间
}).exec(function(err, battles){
    battles = battles || [];
    var qsids = [];
    for(var k = 0; k < battles.length; k++){
        qsids.push(battles[k]._id);
    }
    console.log(qsids);
    QuestionStore.find({
        qsid : {
            $in : qsids
        }
    }, function(err, stores){
        console.log(stores);
        for(var i = 0; i < battles.length; i++){
            var b = battles[i];
            for(var j = 0 ;j < stores.length; j++){
                var s = stores[j];
                b.store = s;
            }
        }
        console.log(battles);
    });
});