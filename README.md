test_game
=========

<<<<<<< HEAD
答题游戏 v1
=======
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



>>>>>>> a46507d80bc86a919a290c08e5fa41066857f7a7
