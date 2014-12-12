/**
 * Created by ASRock on 2014/12/11.
 */

//广播: 不包括自己
//情景模拟:(关键步骤)
//1.小张通过浏览器连接上来
//  1.1:小张查看荣誉榜,游戏规则,查看我的挑战,进入某个题集等(未进入战/练兵场场的操作)
//  1.2:小张进入某个题集,选择某个战场或者开一个练兵场(进入了战场/练兵场)
//  1.2.1: 小张在某场战斗里面取得了胜利
//  1.2.2: 小张在某场战斗里面取得了胜利,并破了该题集的最高历史记录
//  1.2.3  小张在某场战斗里面失败

function BattleIo(){
	this.io = global.io;


	this['onLineData'] = []; //在线人员数据


	this['battleData'] = {}; //挑战者数据
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
					 //状态: I-正在进行 E-跑路 C-完成
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

	this['drillData'] = {}; //练习人员数据
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

//进入挑战  或 获取某题集挑战数据
BattleIo.prototype.battle = function(qsid, bid, sid){
	//如果bid 和 sid为空 则返回挑战数据
	//如果bid 和 sid不为空 则表示进入挑战
	if(bid && sid){

	}else {

		return
	}

}

//进入练习赛 或获取某题集练习数据
BattleIo.prototype.drill = function(qsid, bid, sid){

}

//更新或获取 状态
BattleIo.prototype.status = function(qsid, bid, sid, status){
	//如果status为undefined，则该方法为get方法，即返回当前状态
	//如果status不为undefined，则该方法为set方法，设置属性

}

//更新或获取 答对题目ID
BattleIo.prototype.validaty = function(qsid, bid, sid, qid){

}

//更新或获取 打错题目ID
BattleIo.prototype.mistake = function (qsid, bid, sid, qid) {

}

//更新或获取道具
BattleIo.prototype.property = function(qsid, bid, sid, property) {

}

//更新或获取进度
BattleIo.prototype.progress = function(qsid, bid, sid, proress){

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
	var userId = data.sid;
	if(this.onLineData.indexOf(userId) == -1){
		this.onLineData.push(data.sid);
	}
	console.log("当前在线人数:" + this.onLineData);
}

//服务器IO发出命令

	//1.当有人链接上来,需要记录数据,是否需要广播待定
    //2.

BattleIo.prototype.send = function (type, data) {
	this.io.emit(type, data);
}

module.exports = new BattleIo();
