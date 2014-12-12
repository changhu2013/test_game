
//引入命令常量
var Command = require('../public/command.js');
var moment = require('moment');

function BattleIo(){

	this.io = global.io;

	this.onLineData = {}; //在线人员数据
	/*
	 {
	 	sid1 : {
	 		login : '2014/12/13 2:12:00' //登陆时间
	 	}
	 }
	 */

	this.battleData = {}; //挑战者数据
	/*
	 {
	    qsid1 : {
	    	bid1 : {
				 sid1 : {
					 //道具数量
					 property: 2,
					 //进度
					 progress: 50,
					 //连续答对的题目
					 serialValidity: 0,
					 //答对题目
					 validity:[],
					 //打错题目
					 mistake: [],
					 //状态: W-等待状态 I-正在进行 E-跑路 C-完成
					 status: 'I'
				 },
				 sid2 : {
				 	//另一个挑战者数据
				 }
	    	},

	    	bid2 : {
	    		//另一个战场
	    	}

	    }
	 }
	*/

	this.drillData = {}; //练习人员数据
	/*
	{
	    qsid1 : {
	    	bid1 : {
	    		sid1 : {
	 				//进度
	 				progress: 50,
	 				//答对题目
	 				validity:[],
	 				//打错题目
	 				mistake: [],
	 				//状态: I-正在进行 E-跑路 C-完成
	 				status: 'I'
	    		}
	    	}
	    }
	}
	*/
}

var getBattleMsg = function(qsid, bid, sid){
	var qs = this.battleData[qsid];
	if(!qs){
		qs = this.battleData[qsid] = {};
	}
	var b = qs[bid];
	if(!b){
		b = qs[bid] = {};
	}
	var u = b[sid];
	if(!u){
		u = b[sid] = {
			property:0,
			progress:0,
			serialValidity:0,
			validity:[],
			mistake:[],
			status:'W'
		}
	}
	return u;
};

var getDrillMsg = function(qsid, bid, sid){
	var qs = this.drillData[qsid];
	if(!qs){
		qs = this.drillData[qsid] = {};
	}
	var b = qs[bid];
	if(!b){
		b = qs[bid] = {};
	}
	var u = b[sid];
	if(!u){
		u = b[sid] = {
			progress:0,
			validity:[],
			mistake:[],
			status:'I'
		}
	}
	return u;
};

//进入挑战  或 获取某题集挑战数据
BattleIo.prototype.battle = function(qsid, bid, sid){
	//如果bid 和 sid为空 则返回挑战数据
	//如果bid 和 sid不为空 则表示进入挑战
	if(bid && sid){
		return getBattleMsg(qsid, bid, sid);
	}else {
		var qs = this.battleData[qsid];
		if(!qs){
			qs = this.battleData[qsid] = {};
		}
		return qs;
	}
}

//进入练习赛 或获取某题集练习数据
BattleIo.prototype.drill = function(qsid, bid, sid){
	if(bid && sid){
		return getDrillMsg(qsid, bid, sid);
	}else {
		var qs = this.drillData[qsid];
		if(!qs){
			qs = this.drillData[qsid] = {};
		}
		return qs;
	}
}

//更新或获取 状态
BattleIo.prototype.battleStatus = function(qsid, bid, sid, status){
	//如果status为undefined，则该方法为get方法，即返回当前状态
	//如果status不为undefined，则该方法为set方法，设置属性
	var u = getBattleMsg(qsid, bid, sid);
	if(status){
		u.status = status;
	}else {
		return u.status;
	}
}

//更新或获取 状态
BattleIo.prototype.drillStatus = function(qsid, bid, sid, status){
	//如果status为undefined，则该方法为get方法，即返回当前状态
	//如果status不为undefined，则该方法为set方法，设置属性
	var u = getDrillMsg(qsid, bid, sid);
	if(status){
		u.status = status;
	}else {
		return u.status;
	}
}

//更新或获取 答对题目ID
BattleIo.prototype.battleValidaty = function(qsid, bid, sid, qid){
	var u = getBattleMsg(qsid, bid, sid);
	if(qid){
		u.validity.push(qid);
	}else {
		return u.validity;
	}
}

//更新或获取 答对题目ID
BattleIo.prototype.drillValidaty = function(qsid, bid, sid, qid){
	var u = getDrillMsg(qsid, bid, sid);
	if(qid){
		u.validity.push(qid);
	}else {
		return u.validity;
	}
}

//更新或获取 打错题目ID
BattleIo.prototype.battleMistake = function (qsid, bid, sid, qid) {
	var u = getBattleMsg(qsid, bid, sid);
	if(qid){
		u.mistake.push(qid);
	}else {
		return u.mistake;
	}
}

//更新或获取 打错题目ID
BattleIo.prototype.drillMistake = function (qsid, bid, sid, qid) {
	var u = getDrillMsg(qsid, bid, sid);
	if(qid){
		u.mistake.push(qid);
	}else {
		return u.mistake;
	}
}

//更新或获取道具
BattleIo.prototype.battleProperty = function(qsid, bid, sid, property) {
	var u = getBattleMsg(qsid, bid, sid);
	if(property){
		u.property = property;
	}else {
		return u.property;
	}
}

//更新或获取进度
BattleIo.prototype.battleProgress = function(qsid, bid, sid, proress){
	var u = getBattleMsg(qsid, bid, sid);
	if(proress){
		u.progress = proress;
	}else {
		return u.progress;
	}
}

//更新或获取进度
BattleIo.prototype.drillProgress = function(qsid, bid, sid, proress){
	var u = getDrillMsg(qsid, bid, sid);
	if(proress){
		u.progress = proress;
	}else {
		return u.progress;
	}
}

//服务器IO接收命令
	//1.接收有人连接上来
	//2.接收有人进入了题集
    //3.接收有人进入了题集下面的战场或者练兵场
	//4.接收有人创建了题集下面的战场或者练兵场
	//5.接收战斗或者练兵场结束
	//6.接收战斗或者练兵场逃跑
	//7.接收有人破了该题集的历史记录

BattleIo.prototype.receive = function (type, socket) {
	var top = this;
	socket.on(type, function(data){
		switch (type){
			case 'myConn': top.doNewConn(data);break;
		}
	});
}

//处理新的链接
BattleIo.prototype.doNewConn = function (data) {
	var sid = data.sid;
	var msg = this.onLineData[sid];
	if(!msg){
		msg = this.onLineData[sid] = {};
	}
	msg.login = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
	console.log('user:' + sid + ' login ' + msg.login);
}

//服务器IO发出命令
//1.当有人链接上来,需要记录数据,是否需要广播待定
//2.

BattleIo.prototype.send = function (type, data) {
	this.io.emit(type, data);
}

module.exports = new BattleIo();
