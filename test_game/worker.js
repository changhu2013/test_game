var app = require('./app.js');

var server = require('http').Server(app);

var io = require('socket.io')(server);
require('./models/BattleIo.js').setSocketIo(io);

var worker;
process.on('message', function(data, tcp){
	if(data.msg === 'server'){
		worker = tcp;
		global.sessionCache = data.cache;
		worker.on('connection', function(socket){

			//console.log(global.sessionCache);

			server.emit('connection', socket);
		});
	}
});

process.on('uncaughtException', function(err){
	//向主进程发送自杀信号
	process.send({act:'suicide'});
	//停止接收新的连接
	worker.close(function(){
		//所有连接断开后,退出进程
		process.exit(1);
	});
	//5秒后退出进程, 当连接的是长连接时，设置定时退出
	setTimeout(function(){
		process.exit(1);
	}, 5000);
});
