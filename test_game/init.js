var settings = require('./settings');
var mongoose = require('mongoose');
//mongoose
mongoose.connect('mongodb://' + settings.host + '/' + settings.db);

require('./models/user.js');
require('./models/questioncategory.js');
require('./models/questionstore.js');
require('./models/question.js');
require('./models/battle.js');


var User = mongoose.model('User');
var QuestionCategory = mongoose.model('QuestionCategory');
var QuestionStore = mongoose.model('QuestionStore');
var Question = mongoose.model('Question');
var Battle = mongoose.model('Battle');

//删除之前数据
User.collection.drop();
QuestionCategory.collection.drop();
QuestionStore.collection.drop();
Question.collection.drop();
Battle.collection.drop();

//测试用户
var user = new User({
    sid: '1',
    name: '张三',
    job: '程序员',
    score: 100,
    battles: 78
});
user.save(function (err) {
    if (err) throw err;
});

//测试题目分类
new QuestionCategory({
    qcid: '10',
    pid: '0',
    title: '财务审计部',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });

new QuestionCategory({
    qcid: '11',
    pid: '0',
    title: '市场客服部',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });

new QuestionCategory({
    qcid: '12',
    pid: '0',
    title: '车队运营部',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });


new QuestionCategory({
    qcid: '13',
    pid: '0',
    title: '安全监管部',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });

new QuestionCategory({
    qcid: '20',
    pid: '10',
    title: '财务会计', isParent: true
}).save(function (err) {
        if (err) throw err;
    });

new QuestionCategory({
    qcid: '21',
    pid: '10',
    title: '财务会计',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });

new QuestionCategory({
    qcid: '22',
    pid: '11',
    title: '客服开发',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });

new QuestionCategory({
    qcid: '23',
    pid: '11',
    title: '客服代表',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });

new QuestionCategory({
    qcid: '24',
    pid: '12',
    title: '调度主管',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });

new QuestionCategory({
    qcid: '26',
    pid: '13',
    title: '押运员',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });

new QuestionCategory({
    qcid: '27',
    pid: '13',
    title: '安全主任',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });


new QuestionCategory({
    qcid: '30',
    pid: '24',
    title: '调度助理',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });


new QuestionCategory({
    qcid: '31',
    pid: '25',
    title: '驾驶员',
    isParent: true
}).save(function (err) {
        if (err) throw err;
    });


var qsid = 0;
var qcids = ['10', '11', '12', '13', '20', '21', '23', '24', '25', '26', '27', '30', '31'];
for (var i in qcids) {
    //测试题目集
    for(var g = 0; g < 5; g++){
        var qs = new QuestionStore({
            qsid: '' + (qsid++),
            qcid: qcids[i],
            title: '题目集_' + qsid,
            drillScore: 2,
            battleScore: 20,
            maxTime: 1200,
            bounty: 0,
            papers: ''
        });
        qs.save(function (err) {
            if (err) throw err;
        });
    }
}

var qsid = 0;
var qid = 0;
for (var i in qcids) {
    //测试题目
    for(var g = 0; g < 5; g++){
        qsid++;
        for (var j = 0; j < 5; j++) {
            var q = new Question({
                qid: '' + (qid++),
                qsid: '' + qsid,
                title: '题目：把大象关进冰箱，需要几步?',
                opts: {
                    'A': '3步',
                    'B': '2步',
                    'C': '1步'
                },
                answer: 'A',
                score: 1
            });
            q.score = 1;
            q.save(function (err) {
                if (err) throw err;
            });
        }
    }
}

var qsid = 0;
var bid = 0;
for (var i in qcids) {
    //测试题目
    for(var g = 0; g < 5; g++){
        qsid++;
        //测试挑战数据
        for (var k = 0; k < 5; k++) {
            var b = new Battle({
                bid: '' + (bid++),
                sid: '1',
                qsid: '' + qsid,
                qstitle : '题目集_' + qsid,
                status: bid > 15 ? 'N' : bid > 10 ? 'F' : 'I',
                drillScore: k,
                battleScore: k * 5
            });
            b.save(function (err) {
                if (err) throw err;
            })
        }
    }
}