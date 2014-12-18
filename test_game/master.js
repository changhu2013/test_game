var fork = require('child_process').fork;
var cpus = require('os').cpus();

var server = require('net').createServer();

//var io = require('socket.io')(server);
//require('./models/BattleIo.js').setSocketIo(io);

server.listen(3000);
console.log('启动服务器,监听端口为3000');

//重启次数
var limit = 10;
var during = 60000;
var length  = 0;
var restart = [];
var isTooFrequently = function(){
    //记录重启时间
    var time = Date.now();
    length = restart.push(time);
    if(length > limit){
        //取出最后10个记录
        restart = restart.slice(limit * -1);
    }
    //最后一次重启到前10次重启之间的时间间隔
    return restart.length >= limit && restart[restart.length - 1] - restart[0] < during;
}

var sessionCache = {}; //session会话
var workers = {};
var createWorker = function(){

    //检查是否太过频繁
    if(isTooFrequently()){
        //触发giveup事件后,不再重启
        process.emit('giveup' , length, during);
        return;
    }

    var worker = fork(__dirname + '/worker.js');

    //当接收到自杀信号的时候重启新的进程
    worker.on('message', function(message){
        if(message.act === 'suicide'){
            createWorker();
        }
    });

    //退出时重启新的进程
    worker.on('exit', function(){
        console.log('Worker ' + worker.pid + ' exited.');
        delete workers[worker.pid];
        createWorker();
    });

    //句柄转发
    worker.send({
        msg : 'server',
        cache : sessionCache //session缓存
    }, server);

    workers[worker.pid] = worker;
    console.log('Create worker. pid:' + worker.pid);
};

for(var i = 0; i < cpus.length; i++){
    createWorker();
}

//主进程自己退出时,让所有工作进程退出
process.on('exit', function(){
    for(var pid in workers){
        workers[pid].kill();
    }
});
