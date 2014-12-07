
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var QuestionCategory = new Schema({
    qcid : String,
    pid : String,
    title : String,
    isParent : Boolean
});

mongoose.model('QuestionCategory', QuestionCategory, 'questioncategorys');