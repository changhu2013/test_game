var settings = require('./settings');
var mongoose = require('mongoose');
//mongoose
mongoose.connect('mongodb://' + settings.host + '/' + settings.db);

require('./models/questioncategory.js');
require('./models/questionstore.js');


var QuestionCategory = mongoose.model('QuestionCategory');

for(var i = 0 ;i < 10; i++){

    var qc = new QuestionCategory();
    qc.qcid = '' + i;
    qc.pid = '' + 0;
    qc.title = i + '类题目';

    qc.save(function(err){
        if(err) throw err;
    })

    for(var j = 0; j < 5; j++){
        var qcc = new QuestionCategory();
        qcc.qcid = i+'-'+j;
        qcc.pid = '' + i;
        qcc.title =  i + '-' + j + '类题目';

        qcc.save(function(err){
            if(err) throw err;
        })
    }
}




