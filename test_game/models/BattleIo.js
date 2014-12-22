
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

//设置IO
BattleIo.prototype.setWorker = function(worker){
	this.worker = worker;
};

//向socket.io子进程发送消息
BattleIo.prototype.sendWorkerMsg = function(method){
	var args = [];
	for(var i = 1; i < arguments.length;i++){
		args.push(arguments[i]);
	}
	if(this.worker){
		this.worker.broadcast('socket.io', {
			method : method,
			args : args
		});
		this.worker.broadcast('http', {
			method : method,
			args : args
		});
	}
	//向其他子进程发送消息
	process.send({
        type : 'broadcast',
        from  : process.pid,
        data : {
            method : method,
            args : args
        }
    });
}

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
		this.io.sockets.in(rid).emit(command, data);
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
	this.doSetWarZoneData(qs_id, sid, name);
	this.sendWorkerMsg('doSetWarZoneData', qs_id, sid, name);
}

BattleIo.prototype.doSetWarZoneData = function (qs_id, sid, name) {
	if(!this.warZoneData[qs_id]){
		this.warZoneData[qs_id] = [];
	}
	var obj = {sid: sid, name: name};
	this.warZoneData[qs_id].push(obj);
}


//获取练习赛信息
//如果 bid 和 sid 均为undefined, 则返回该题集下的练习赛信息
//如果 sid 为undefined 则返回该练习信息
BattleIo.prototype.getDrillMsg = function(qsid, sid){
	var qs = this.drillData[qsid];
	if(!qs){
		qs = this.drillData[qsid] = {};
	}
	if(sid == undefined){
		return qs;
	}
	var u = qs[sid];
	if(!u){
		u = qs[sid] = {
			progress:0,
			validity:[],
			mistake:[],
			status:'I'
		}
	}
	return u;
};

//进入战场
BattleIo.prototype.joinWarZone = function(qsid, sid, name){
	this.doJoinWarZone(qsid, sid, name);
	this.sendWorkerMsg('doJoinWarZone', qsid, sid, name);
}

BattleIo.prototype.doJoinWarZone = function(qsid, sid, name){
	var u = this.getOnLineMsg(sid);
	if(u){
		this.setWarZoneData(qsid, sid, name)
		var rid = 'battle-' + qsid;
		u.socket.join(rid);
	}
}


//加入挑战
BattleIo.prototype.joinBattle = function(qsid, bid, sid, name){
	this.doJoinBattle(qsid, bid, sid, name);
	this.sendWorkerMsg('doJoinBattle', qsid, bid, sid, name);
}

BattleIo.prototype.doJoinBattle = function(qsid, bid, sid, name){
	var u = this.getOnLineMsg(sid);
	if(u){
		//记录挑战消息
		this.getBattleMsg(qsid, bid, sid, name);

		//在该房间内广播有人加入挑战的消息
		var rid = 'battle-' + qsid + '-' + bid;

		//先向战场广播
		u.socket.to('battle-' + qsid).emit(Command.JOIN_STORE, this.getBattleMsg(qsid));
		u.socket.leave('battle-' + qsid);
		u.socket.join(rid);
		this.io.sockets.in(rid).emit(Command.JOIN_BATTLE, this.getBattleMsg(qsid, bid));
	}
}

//开始挑战
BattleIo.prototype.startBattle = function(qsid, bid, sid){
	this.doStartBattle(qsid, bid, sid);
	this.sendWorkerMsg('doStartBattle', qsid, bid, sid);
}

BattleIo.prototype.doStartBattle = function(qsid, bid, sid){
	var u = this.getOnLineMsg(sid);
	if(u){
		this.getBattleMsg(qsid, bid, sid)['start'] = new Date();
		//在该房间内广播有人开始挑战的消息
		var rid = 'battle-' + qsid + '-' + bid;
		u.socket.in('battle-' + qsid).emit(Command.START_BATTLE, {
			bid: bid
		});
		u.socket.in(rid).emit(Command.START_BATTLE);
	}
}

//进入练习赛
BattleIo.prototype.joinDrill = function(qsid, sid){
	this.doJoinDrill(qsid, sid);
	this.sendWorkerMsg('doJoinDrill', qsid, sid);
}

//进入练习赛
BattleIo.prototype.doJoinDrill = function(qsid, sid){
	var u = this.getOnLineMsg(sid);
	if(u){
		this.getDrillMsg(qsid, sid);
		var rid = 'drill-' + qsid;
		u.socket.join(rid);
		u.socket.to(rid).emit(Command.JOIN_DRILL, rid);
	}
}

//更新或获取 状态
BattleIo.prototype.battleStatus = function(qsid, bid, sid, status){
	//如果status为undefined，则该方法为get方法，即返回当前状态
	//如果status不为undefined，则该方法为set方法，设置属性
	var u = this.getBattleMsg(qsid, bid, sid);
	if(status){
		this.updateBattleStatus(qsid, bid, sid, status);
		this.sendWorkerMsg('updateBattleStatus', qsid, bid, sid, status);
	}else {
		return u.status;
	}
}

BattleIo.prototype.updateBattleStatus = function(qsid, bid, sid, status){
	var u = this.getBattleMsg(qsid, bid, sid);
	u.status = status;

	//在该房间内广播战报消息
	var rid = 'battle-' + qsid + '-' + bid;
	u['sid'] = sid;
	this.broadcast(sid, rid, Command.BATTLE_NEWS, {
		type: 'STATUS',
		user: u
	});
}


//更新或获取 状态
BattleIo.prototype.drillStatus = function(qsid, sid, status){
	//如果status为undefined，则该方法为get方法，即返回当前状态
	//如果status不为undefined，则该方法为set方法，设置属性
	var u = this.getDrillMsg(qsid, sid);
	if(status){
		this.updateDrillStatus(qsid, sid, status);
		this.sendWorkerMsg('updateDrillStatus', qsid, sid, status);
	}else {
		return u.status;
	}
}

BattleIo.prototype.updateDrillStatus = function(qsid, sid, status){
	var u = this.getDrillMsg(qsid, sid);
	u.status = status;
}

//更新或获取 答对题目ID
BattleIo.prototype.battleValidaty = function(qsid, bid, sid, qid){
	var u = this.getBattleMsg(qsid, bid, sid);
	if(qid){
		this.updateBattleValidaty(qsid, bid, sid, qid);
		this.sendWorkerMsg('updateBattleValidaty', qsid, bid, sid, qid);
	}else {
		return u.validity;
	}
}

BattleIo.prototype.updateBattleValidaty = function(qsid, bid, sid, qid){
	var u = this.getBattleMsg(qsid, bid, sid);
	u.validity.push(qid);

	//在该房间内广播战报消息
	var rid = 'battle-' + qsid + '-' + bid;
	u['sid'] = sid;
	this.broadcast(sid, rid, Command.BATTLE_NEWS, {
		type: 'VALIDATY',
		user: u
	});
}

//更新或获取 答对题目ID
BattleIo.prototype.drillValidaty = function(qsid, sid, qid){
	var u = this.getDrillMsg(qsid, sid);
	if(qid){
		this.updateDrillValidaty(qsid, sid, qid);
		this.sendWorkerMsg('updateDrillValidaty', qsid, sid, qid);
	}else {
		return u.validity;
	}
}

BattleIo.prototype.updateDrillValidaty = function(qsid, sid, qid){
	var u = this.getDrillMsg(qsid, sid);
	u.validity.push(qid);
}

//更新或获取 答错题目ID
BattleIo.prototype.battleMistake = function (qsid, bid, sid, qid) {
	var u = this.getBattleMsg(qsid, bid, sid);
	if(qid){
		this.updateBattleMistake(qsid, bid, sid, qid);
		this.sendWorkerMsg('updateBattleMistake', qsid, bid, sid, qid);
	}else {
		return u.mistake;
	}
}

BattleIo.prototype.updateBattleMistake = function (qsid, bid, sid, qid) {
	var u = this.getBattleMsg(qsid, bid, sid);
	u.mistake.push(qid);

	//在该房间内广播战报消息
	var rid = 'battle-' + qsid + '-' + bid;
	u['sid'] = sid;
	this.broadcast(sid, rid, Command.BATTLE_NEWS, {
		type: 'MISTAKE',
		user: u
	});
}

//更新或获取 打错题目ID
BattleIo.prototype.drillMistake = function (qsid, sid, qid) {
	var u = this.getDrillMsg(qsid, sid);
	if(qid){
		this.updateDrillMistake(qsid, sid, qid);
		this.sendWorkerMsg('updateDrillMistake', qsid, sid, qid);
	}else {
		return u.mistake;
	}
}

BattleIo.prototype.updateDrillMistake = function (qsid, sid, qid) {
	var u = this.getDrillMsg(qsid, sid);
	u.mistake.push(qid);
}


//更新 连续答对题目数
BattleIo.prototype.battleSerialValidity = function (qsid, bid, sid, serialValidity) {
	console.log('serialValidity  '+ serialValidity);
	var u = this.getBattleMsg(qsid, bid, sid);
	if(typeof serialValidity != 'undefined') {
		this.updateBattleSerialValidity(qsid, bid, sid, serialValidity);
		this.sendWorkerMsg('updateBattleSerialValidity', qsid, bid, sid, serialValidity);
	} else {
		return u.serialValidity;
	}
}

BattleIo.prototype.updateBattleSerialValidity = function (qsid, bid, sid, serialValidity) {
	console.log('serialValidity  '+ serialValidity);
	var u = this.getBattleMsg(qsid, bid, sid);
	if(typeof serialValidity != 'undefined') {
		u.serialValidity = serialValidity;
		console.log(" u.serialValidity:  " + u.serialValidity);
		if(u.serialValidity == 5){//当连续答对5道题时候,增加一个道具
			this.battleProperty(qsid, bid, sid, u.property + 1); //增加一个道具
			u.serialValidity = 0; //并将连续答对的题目清0
		}
		//在该房间内广播战报消息
		var rid = 'battle-' + qsid + '-' + bid;
		u['sid'] = sid;
		this.broadcast(sid, rid, Command.BATTLE_NEWS, {
			type: 'SERIALVALIDATY',
			user: u
		});
	} else {
		return u.serialValidity;
	}
}

//更新或获取道具
BattleIo.prototype.battleProperty = function(qsid, bid, sid, property) {
	var u = this.getBattleMsg(qsid, bid, sid);
	if(typeof property != 'undefined'){
		this.updateBattleProperty(qsid, bid, sid, property);
		this.sendWorkerMsg('updateBattleProperty', qsid, bid, sid, property);
	}else {
		return u.property;
	}
}

//更新或获取道具
BattleIo.prototype.updateBattleProperty = function(qsid, bid, sid, property) {
	var u = this.getBattleMsg(qsid, bid, sid);
	u.property = property;

	//在该房间内广播战报消息
	var rid = 'battle-' + qsid + '-' + bid;
	u['sid'] = sid;
	this.broadcast(sid, rid, Command.BATTLE_NEWS, {
		type: 'PROPERTY',
		user: u
	});
}

//更新或获取进度
BattleIo.prototype.battleProgress = function(qsid, bid, sid, proress){
	var u = this.getBattleMsg(qsid, bid, sid);
	if(proress){
		this.updateBattleProgress(qsid, bid, sid, proress);
		this.sendWorkerMsg('updateBattleProgress', qsid, bid, sid, proress);
	}else {
		return u.progress;
	}
}

BattleIo.prototype.updateBattleProgress = function(qsid, bid, sid, proress){
	var u = this.getBattleMsg(qsid, bid, sid);

	u.progress = proress;
	//在该房间内广播战报消息
	var rid = 'battle-' + qsid + '-' + bid;
	u['sid'] = sid;
	this.broadcast(sid, rid, Command.BATTLE_NEWS, {
		type: 'PROGRESS',
		user: u
	});
}

//更新或获取进度
BattleIo.prototype.drillProgress = function(qsid, sid, proress){
	var u = this.getDrillMsg(qsid, sid);
	if(proress){
		u.progress = proress
		this.updateDrillProgress(qsid, sid, proress);
		this.sendWorkerMsg('updateDrillProgress', qsid, sid, proress);
	}else {
		return u.progress;
	}
}

BattleIo.prototype.updateDrillProgress = function(qsid, sid, proress){
	var u = this.getDrillMsg(qsid, sid);
	u.progress = proress;
}

//处理新的链接
BattleIo.prototype.login = function (sid, socket) {
	this.doLogin(sid, socket);
	this.sendWorkerMsg('doLogin', sid, undefined);
}

BattleIo.prototype.doLogin = function (sid, socket) {
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
