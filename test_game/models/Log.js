
var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

var Log = new Schema({
    sid : String,
    name : String,
    action : String,
    time : Date
});

mongoose.model('Log', Log, 'logs');
