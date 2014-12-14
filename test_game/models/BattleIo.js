
//引入命令常量
var Command = require('../public/command.js');
var moment = require('moment');

function BattleIo(){

	this.onLineData = {}; //在线人员数据
	/*
	 {
	 	sid1 : {
	 		login : '2014/12/13 2:12:00' //登陆时间
	 	}
	 }
	 */

	this.warZoneData = {}; //进入战场的人员数据
	/**
	 * this.warZoneData = {
	 *  qsid: [{
	 *  	sid: sid,
	 *  	name: name
	 *  }, {
	 *  	sid: sid,
	 *  	name: name
	 *  }]
	 * }
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


//设置IO
BattleIo.prototype.setSocketIo = function(io){

	var me = this;
	this.io = io;
	this.io.on('connection', function(socket){

		console.log('连接上了' );

		//当接收到客户端发送来的READY命令侯表示登陆成功
		socket.on(Command.CLIENT_READY, function(data){

			console.log(data);

			//console.log(me.login);
			var sid = data.sid;
			me.login(sid, socket);
		});
	});
	//TODO : 下线消息出力

	return this;
};

//给某人发送消息
BattleIo.prototype.send =function(sid, command, data){
	console.log('发送:' + command + ' ' + data);
	var u = this.onLineData[sid];
	if(u){
		u.socket.emit(command, data);
	}
}

//广播
BattleIo.prototype.broadcast = function(sid, rid, command, data){
	console.log('广播：' + command + ' ' + data);
	var u = this.onLineData[sid];
	if(u){
		u.socket.to(rid).emit(command, data);
	}
}

//获取改用户的在线信息
BattleIo.prototype.getOnLineMsg = function(sid){
	var u = this.onLineData[sid];
	if(u && u.socket){
		return u;
	}
}

//获取挑战信息
//如果 bid 和 sid 均为undefined 则返回挑战题集信息
//如果 sid 为undefined 则返回战斗信息
BattleIo.prototype.getBattleMsg = function(qsid, bid, sid, name){
	var qs = this.battleData[qsid];
	if(!qs){
		qs = this.battleData[qsid] = {};
	}
	if(bid == undefined && sid == undefined){
		return qs;
	}
	var b = qs[bid];
	if(!b){
		b = qs[bid] = {};
	}
	if(sid == undefined){
		return b;
	}
	var u = b[sid];
	if(!u){
		u = b[sid] = {
			name: name,
			property:0,
			progress:0,
			serialValidity:0,
			validity:[],
			mistake:[],
			status:'W'
		}
	}
	console.log("print:" + this.battleData);
	return u;
};


BattleIo.prototype.getWarZoneData = function (qs_id) {
	return this.warZoneData[qs_id];
}

BattleIo.prototype.setWarZoneData = function (qs_id, sid, name) {
	if(!this.warZoneData[qs_id]){
		this.warZoneData[qs_id] = [];
	}
	var obj = {sid: sid, name: name};
	this.warZoneData[qs_id].push(obj);
}

//获取练习赛信息
//如果 bid 和 sid 均为undefined, 则返回该题集下的练习赛信息
//如果 sid 为undefined 则返回该练习信息
BattleIo.prototype.getDrillMsg = function(qsid, bid, sid){
	var qs = this.drillData[qsid];
	if(!qs){
		qs = this.drillData[qsid] = {};
	}
	if(bid == undefined && sid == undefined){
		return qs;
	}
	var b = qs[bid];
	if(!b){
		b = qs[bid] = {};
	}
	if(sid == undefined){
		return b;
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
	console.log("当前加入的人:" + b);
	return u;
};

//进入战场
BattleIo.prototype.joinWarZone = function(qsid, sid, name){
	var u = this.getOnLineMsg(sid);
	if(u){
		this.setWarZoneData(qsid, sid, name)
		var rid = 'battle-' + qsid;
		u.socket.join(rid);
	}
}

//加入挑战
BattleIo.prototype.joinBattle = function(qsid, bid, sid, name){
	var u = this.getOnLineMsg(sid);
	if(u){
		//记录挑战消息
		this.getBattleMsg(qsid, bid, sid, name);

		//在该房间内广播有人加入挑战的消息
		var rid = 'battle-' + qsid + '-' + bid;

		//先向战场广播
		u.socket.to('battle-' + qsid).emit(Command.JOIN_WARZONE, this.getBattleMsg(qsid));

		u.socket.join(rid);
		u.socket.in(rid).emit(Command.JOIN_BATTLE, this.getBattleMsg(qsid, bid));
	}
}

//进入练习赛
BattleIo.prototype.joinDrill = function(qsid, bid, sid){
	var u = this.getOnLineMsg(sid);
	if(u){
		this.getDrillMsg(qsid, bid, sid);

		var rid = 'drill-' + qsid;
		u.socket.join(rid);
		u.socket.to(rid).emit(Command.JOIN_DRILL, '加入练习房间:' + rid);
	}
}

//更新或获取 状态
BattleIo.prototype.battleStatus = function(qsid, bid, sid, status){
	//如果status为undefined，则该方法为get方法，即返回当前状态
	//如果status不为undefined，则该方法为set方法，设置属性
	var u = getBattleMsg(qsid, bid, sid);
	if(status){
		u.status = status;

		//在该房间内广播战报消息
		var rid = 'battle-' + qsid + '-' + bid;
		this.broadcast(sid, rid, Command.BATTLE_NEWS, u);
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

		//在该房间内广播战报消息
		var rid = 'battle-' + qsid + '-' + bid;
		this.broadcast(sid, rid, Command.BATTLE_NEWS, u);
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

		//在该房间内广播战报消息
		var rid = 'battle-' + qsid + '-' + bid;
		this.broadcast(sid, rid, Command.BATTLE_NEWS, u);
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

		//在该房间内广播战报消息
		var rid = 'battle-' + qsid + '-' + bid;
		this.broadcast(sid, rid, Command.BATTLE_NEWS, u);
	}else {
		return u.property;
	}
}

//更新或获取进度
BattleIo.prototype.battleProgress = function(qsid, bid, sid, proress){
	var u = getBattleMsg(qsid, bid, sid);
	if(proress){
		u.progress = proress;

		//在该房间内广播战报消息
		var rid = 'battle-' + qsid + '-' + bid;
		this.broadcast(sid, rid, Command.BATTLE_NEWS, u);
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

//处理新的链接
BattleIo.prototype.login = function (sid, socket) {
	var msg = this.onLineData[sid];
	if(!msg){
		msg = this.onLineData[sid] = {};
	}
	msg.socket = socket;
	msg.login = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

	console.log('user:' + sid + ' login ' + msg.login);

	//向客户端发送消息，服务器已经准备好了
	this.send(sid, Command.SERVER_READY);
}


module.exports = new BattleIo();
