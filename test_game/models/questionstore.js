
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var QuestionStore = new Schema({
    qsid : String,
    qcid : String,
    title : String,
    drillScore : Number,
    battleScore : Number,
    maxTime : Number,
    bounty : Number,
    papers : String
});

mongoose.model('QuestionStore', QuestionStore, 'questionstores');

