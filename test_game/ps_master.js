

var http = require('http'),
    numCPUs = require('os').cpus().length,
    cp = require('child_process'),
    net = require('net');

var workers = [];

function eachWorker(callback) {
    for (var idx in workers) {
        callback(workers[idx]);
    }
}

for (var i = 0; i < numCPUs; i++) {
    var worker = cp.fork('ps_worker.js');
    worker.on('message', function(msg){
        console.log('接收到消息:' + JSON.stringify(msg));
        if (msg.type == 'broadcast') {
            var from = msg.from;
            //发送给其他的子进程
            eachWorker(function (w) {
                console.log(w.pid);
                if (w.pid !== from) {
                    msg.type = 'send';
                    msg.to = w.pid;
                    w.send(msg);
                }
            });
            //发送给socket.io
            msg.type = 'send';
            msg.to = socket.pid;
            socket.send(msg);
        }
    });
    workers.push(worker);
}

//http请求
net.createServer(function (s) {
    s.pause();
    var worker = workers.shift();
    worker.send('c', s);
    workers.push(worker);
}).listen(3000);

//web socket请求
var socket = cp.fork('ps_socket.io.js');
net.createServer(function (s) {
    s.pause();
    socket.send('c', s);
}).listen(3001);

//主进程关闭后关闭所有子进程
process.on('exit', function(){
    eachWorker(function(w){
        w.kill();
    });
    socket.kill();
});
