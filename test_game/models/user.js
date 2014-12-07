var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    sid: String,
    name: String,
    job: String,
    score: Number,
    battles: Number
});

mongoose.model('user', User);