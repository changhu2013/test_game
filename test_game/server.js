var app = require('./app.js');

var http = require('http').Server(app);
var io = require('socket.io')(http);

require('./models/BattleIo.js').setSocketIo(io);

http.listen(3000);

console.log('启动服务器,监听端口为3000');