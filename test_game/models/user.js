var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    sid: String,
    name: String,
    job: String,
    score: Number,
    battles: Number
});
/**
 * @arg1 模型名
 * @arg2 Schema名
 * @arg3 collection名 如果未指定,则会在数据库中将arg1小写+s作为conllection的名
 */
mongoose.model('User', UserSchema, 'user');