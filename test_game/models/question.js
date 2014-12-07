var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var Question = new Schema({
    qid : String,
    qsid : String,
    title : String,
    options : Object,
    answer : String,
    score : Number
});

mongoose.model('Question', Question, 'questions');
