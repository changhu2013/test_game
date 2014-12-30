

var http = require('http').createServer(function(req, res){
    res.end('这个是web socket服务');
});

var worker = require('pm').createWorker();

var io = require('socket.io')(http);
var battleIo = require('./models/BattleIo.js');

battleIo.setSocketIo(io);

worker.on('message', function(msg, from, pid){
    console.log('接收到http服务发送来的消息 ' + from + '   ' + pid);
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
