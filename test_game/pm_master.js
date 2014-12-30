

var app = require('pm').createMaster({
    pidfile : 'bench.pid',
    statusfile : 'status.log',
    heartbeat_interval : 2000
});

app.on('giveup', function(name, fatals, pause){
    console.log('Master giveup to restart "%s" process after %d times. pm will try after %d ms.', name, fatals, pause);
});

app.on('disconnect', function (worker, pid) {
    // var w = cluster.fork();
    console.error('[%s] [master:%s] wroker:%s disconnect! new worker:%s fork',
        new Date(), process.pid, worker.process.pid); //, w.process.pid);
});

app.on('fork', function () {
    console.log('fork', arguments);
});

app.on('quit', function () {
    console.log('quit', arguments);
});


//除socket.io以外的其他所有服务
var cpus = require('os').cpus().length;

if(cpus >= 2){
    app.register('http', __dirname + '/pm_worker.js', {
        listen : 3000,           //主进程绑定的端口
        children : cpus - 1   //主机有多少CPU则启动多少子进程
    });
    //用于socket.io
    app.register('socket.io', __dirname + '/pm_socket.io.js', {
        listen : 3001,           //主进程绑定的端口
        children : 1   //主机有多少CPU则启动多少子进程
    });
} else {
    //用于所有服务
    app.register('http', __dirname + '/pm_socket.io.js', {
        listen : 3001,           //主进程绑定的端口
        children : 1             //主机有多少CPU则启动多少子进程
    });
}

app.dispatch();