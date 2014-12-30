
var app = require('./app.js');
var http = require('http').createServer(app);


//以下注释内容为使用pm管理进程的代码,不支持windows系统
var worker = require('pm').createWorker();
var battleIo = require('./models/BattleIo.js');
battleIo.setWorker(worker);
worker.on('message', function(msg, from, pid){
	console.log('接收到socket.io服务发送来的消息 ' + from + ' ' + pid);
	console.log(msg);

	var method = msg.method;
	var args = msg.args;
	battleIo[method].call(battleIo, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
});
worker.ready(function(socket, port) {
	http.emit('connection', socket);
});
worker.on('suicide', function (by) {
	console.log('suicide by ' + by);
});

