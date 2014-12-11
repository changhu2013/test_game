/**
 *
 * 该文件用于删除数据库中的Collection
 */
var settings = require('./settings');
var mongoose = require('mongoose');
mongoose.connect('mongodb://' + settings.host + '/' + settings.db);

require('./models/user.js');
require('./models/questioncategory.js');
require('./models/questionstore.js');
require('./models/question.js');
require('./models/battle.js');
require('./models/storebattle.js');

var User = mongoose.model('User');
var QuestionCategory = mongoose.model('QuestionCategory');
var QuestionStore = mongoose.model('QuestionStore');
var Question = mongoose.model('Question');
var Battle = mongoose.model('Battle');
var StoreBattle = mongoose.model('StoreBattle');

User.collection.drop();
QuestionCategory.collection.drop();
QuestionStore.collection.drop();
Question.collection.drop();
Battle.collection.drop();
StoreBattle.collection.drop();
