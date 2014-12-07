var settings = require('./settings');
var mongoose = require('mongoose');
//mongoose
mongoose.connect('mongodb://' + settings.host + '/' + settings.db);

require('./models/questioncategory.js');
require('./models/questionstore.js');
require('./models/question.js');


var QuestionCategory = mongoose.model('QuestionCategory');
var Question = mongoose.model('Question');

for(var i = 0 ;i < 10; i++){

    var qc = new QuestionCategory();
    qc.qcid = '' + i;
    qc.pid = '' + 0;
    qc.title = i + '类题目';
    qc.isParent = true;

    qc.save(function(err){
        if(err) throw err;
    })

    for(var j = 0; j < 5; j++){
        var qcc = new QuestionCategory();
        qcc.qcid = i+'-'+j;
        qcc.pid = '' + i;
        qcc.title =  i + '-' + j + '类题目';
        qcc.isParent = false;

        qcc.save(function(err){
            if(err) throw err;
        })

    }

    for(var k = 0 ; k < 10; k++){
        var q  = new Question();

        q.qid = '' + k;
        q.qsid = '' + i;
        q.title = '第' + i +  '题:XXXXXXXXXXXXXXXXXXX';
        q.opts = {
            a:'AAAAAAAAAAAAAAAAAAA',
            b:'BBBBBBBBBBBBBBBBB',
            c:'CCCCCCCCCCCCCCCCC'
        };
        q.answer = 'a';
        q.score = 1;

        q.save(function(err){
            if(err) throw err;
        })

    }
}




