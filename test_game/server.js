var app = require('./app.js');



var http = require('http').Server(app);
var io = require('socket.io')(http);
global.io = io;
io.on('connection', function(socket){
	//像其他所有客户端广播(不包含自己)
	socket.broadcast.emit('new connect', '有人进来了');
	 /*socket.join('room');
	 io.sockets.in('room').emit('new user', '这是房间room');*/
	io.emit('conn', socket.id);
	socket.on('addwar', function(obj){
		var wid = obj.wid;
		socket.join('room-' + wid);
		io.sockets.in('room-' + wid).emit('addwarsucc', '这是房间room' + wid);
	});


	var battleIo = require('./models/BattleIo.js');
	battleIo.send('ready');
	battleIo.receive('myConn', socket);
});

io.on('disconnect', function(){
	console("断开了");
});

http.listen(3000);
console.log('启动服务器,监听端口为3000');