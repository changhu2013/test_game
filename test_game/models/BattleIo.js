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

function BattleIo(){}

BattleIo['onLineData'] = {}; //在线人员数据
BattleIo['warZoneData'] = {}; //在题集里人员数据(未进入战场和练兵场)
BattleIo['battleData'] = {}; //在某个题集下的战斗中的人员
BattleIo['drillData'] = {}; //在某个题集下的练习的人员

//服务器IO接收命令
	//1.接收有人连接上来
	//2.接收有人进入了题集
    //3.接收有人进入了题集下面的战场或者练兵场
	//4.接收战斗或者练兵场结束
	//5.接收战斗或者练兵场逃跑
	//

//服务器IO发出命令


