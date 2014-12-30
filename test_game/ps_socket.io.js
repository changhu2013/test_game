var server = require('http').createServer(function (req, res) {
    res.end('这个是web socket服务');
});

var io = require('socket.io')(server);
var battleIo = require('./models/BattleIo.js');
battleIo.setSocketIo(io);

process.on('message', function (msg) {
    process.nextTick(function () {
        if (msg.type == 'send' && msg.to == process.pid){
            console.log('接收到消息:' + JSON.stringify(msg));

            var data = msg.data;
            var method = data.method;
            var args = data.args || [];
            var a = args[0] ? args[0] : undefined;
            var b = args[1] ? args[1] : undefined;
            var c = args[2] ? args[2] : undefined;
            var d = args[3] ? args[3] : undefined;
            var e = args[4] ? args[4] : undefined;
            var f = args[5] ? args[5] : undefined;
            var g = args[6] ? args[6] : undefined;
            var h = args[7] ? args[7] : undefined;

            battleIo[method].call(battleIo, a, b, c, d, e, f, g, h);
        }
    });
});

process.on("message", function (msg, socket) {
    process.nextTick(function () {
        if (msg == 'c' && socket) {
            socket.readable = socket.writable = true;
            socket.resume();
            //server.connections++;
            //server.getConnections();
            socket.server = server;
            server.emit("connection", socket);
            socket.emit("connect");
        }
    });
});
