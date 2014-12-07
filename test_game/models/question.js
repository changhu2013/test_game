var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var Mixed = mongoose.Schema.Types.Mixed;
var Question = new Schema({
    qid : String,
    qsid : String,
    title : String,
    opts : Mixed,
    answer : String,
    score : Number
});

mongoose.model('Question', Question, 'questions');
