var os = require('os');
var fs = require('fs');


var Setting = function (data) {
    this.data = data ;
};

var pf = os.platform().toString();
var file =  __dirname + (pf == 'win32' ? '\\' : '/') + 'config.json';
console.log(file);
fs.openSync(file, 'a');

var doInit = function(){
    var str = fs.readFileSync(file, 'UTF-8');
    if(str == '' || str == undefined){
        str = '{}';
    }
    console.log(str);
    var data = JSON.parse(str);

    //时间占比
    if(data['timeScorePct'] == undefined){
        data['timeScorePct'] = 0.2;
    }

    //人数占比
    if(data['userScorePct'] == undefined){
        data['userScorePct'] = 0.3;
    }

    //成功与否占比
    if(data['succScorePct'] == undefined){
        data['succScorePct'] = 0.4;
    }

    //参站报名积分
    if(data['battleEntryFee'] == undefined){
        data['battleEntryFee'] = 5;
    }

    //挑战最多人数
    if(data['battleMaxUserNum'] == undefined){
        data['battleMaxUserNum'] = 5;
    }

    //挑战最少人数
    if(data['battleMinUserNum'] == undefined){
        data['battleMinUserNum'] = 2;
    }

    //成功百分比
    if(data['userSuccPct'] == undefined){
        data['userSuccPct'] = 0.6;
    }

    //每个题集下生成的试卷的数量
    if(data['paperNum'] == undefined){
        data['paperNum'] = 10;
    }

    //每个挑战题目数量
    if(data['battleQuestionNum'] == undefined){
        data['battleQuestionNum'] = 20;
    }
    //保存
    doSave(data);

    return data;
};

var doSave = function (data) {
    var str = JSON.stringify(data);
    fs.writeFileSync(file, str, 'UTF-8');
};

Setting.prototype.init = function(){
    this.data = doInit();
};

Setting.prototype.save = function(){
    doSave(this.data);
};

Setting.prototype.set = function(key, value){
    this.data[key] = value;
    this.save();
};

Setting.prototype.get = function(key){
    return this.data[key];
};

Setting.prototype.getData = function(){
    return this.data;
};

module.exports = new Setting(doInit());
