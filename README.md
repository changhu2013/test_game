test_game
=========
答题游戏 v1

安装好mongodb后 需要新建data存储数据 logs/mongodb.log来存储日志
CMD: mongod.exe --dbpath=D:\mongo\data --logpath=d:\mongo\logs\mongdb.log --install 自动启动
新开CMD: mongo 即可

1.建库: 
use test_game

2.建collection  类似于表
db.createCollection("user")

3.插入数据 
db.user.insert({sid:101, name:'张三'})

4.查询数据
db.user.find()
db.users.find({sid:"102"})


------  index.js
/main   首页

/honor 荣誉榜

/mybattles  我的挑战

/manual 游戏规则

/warzone/:qs_id  战区  列出某某题集下的正在进行的挑战，以及每个挑战下的人名


------ battle.js
/battle/:b_id  挑战 挑战界面， 进行挑战



/ranklist 战区内积分排行榜

/drillwar/:qs_id  练兵场


