test_game
=========
答题游戏

### 安装部署

> * Node :该项目在node 0.10.29版本测试通过
> * 数据库:该项目在mongodb 2.6版本测试通过

### Node

>
> * npm 依赖资源安装

>> + 运行命令 <pre>cd c:/test_game/</pre> 进入目录,即package.json所在目录

>> + 运行命令 <pre>npm install</pre> 下载该项目依赖的第三方模块,<div style="color:red;">如果已经下载则此操作跳过</div>

> * 修改配置，系统数据库配置文件为test_game目录下的config.js文件
>
><pre style="background-color:green;"><code style="background-color:green;color:white;">
>module.exports = {
>    port : 3000, //服务端口
>    cookieSecret : 'test_game_cookie',
>    sessionMaxAge : 600000,  //会话保存时间 10分钟
>    db : 'test_game', //数据库名称
>    host : '127.0.0.1', //数据库服务地址
>    user : 'admin', //用户名
>    pwd : 'pass' //密码
>};</code></pre>

> + 运行命令<pre>node server.js</pre>启动服务

> + 数据导入，访问<a href="http://127.0.0.1:3000/admin">http://127.0.0.1:3000/admin</a>页面进行系统运行参数配置、用户导入、题目分类管理、题目导入以及系统报表的导出

>> + 用户导入，在项目test_game/data 目录下有**测试用户.csv**文件，可用于测试导入用户，用户可根据此文件格式编辑成实际数据以完成真实用户数据导入
>> + 题目导入，在项目test_game/data 目录下有**测试题目.json**文件，可用于测试数据导入

> + 访问服务，访问<a href="http://127.0.0.1:3000/?sid=1001">http://127.0.0.1:3000/?sid=1001</a>，参数sid=1001为用户的ID，可根据实际情况修改

>

### 数据库

>
> * 数据库启动

>> + 运行命令<pre>mongodb --dbpath c:\mongodb\data</pre> 启动数据库服务 <span style="color:red;">c:\mongodb\data 为特定的数据存储路径,根据实际情况修改</span>

> * 数据库初始化

>> + 运行命令 <pre>mongo</pre> 打开mongo shell

>> + 输入命令 <pre>show dbs;</pre>查看已有的数据库列表

>> + 输入命令 <pre>use test_game;</pre>进入test_game数据库

>> + 输入命令 <pre>show collections;</pre>查看创建的集合

>


<!--
>> + 输入命令 <pre>load('c:/test_game/data/data.js')</pre> 导入数据,data.js文件是基础数据导入脚本，可根据实际情况修改该脚本导入初始化数据
-->

<!--

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

----------------------------
服务启动
node server.js

----------------------------


------  index.js
/main   首页

/honor 荣誉榜

/mybattles  我的挑战

/manual 游戏规则

/warzone/:qs_id  战区  列出某某题集下的正在进行的挑战，以及每个挑战下的人名


------ battle.js
/battle/:b_id  挑战 挑战界面， 进行挑战
/getWarzoneData 获取战场信息 列出某某题集下的正在进行的挑战，以及每个挑战下的人名
/createBattle/:qs_id 创建一个战场


/ranklist 战区内积分排行榜

/drillwar/:qs_id  练兵场



==================================

1 首页；最近战区中的当前人数
2 进入题集：显示正在进行的战场列表，从内存中取数据
3 进入题集：排行榜- 显示该题集下的人的积分列表 OK
4 进入题集：删除练兵场后的战场链接 OK
5 进入题集：建立新的战场
6 编写命令的常量模型 前后台通用的模块
7 完成battleIo中方法
8 战场重构


S -> C
READY -- 表示服务器准备好了
BROADCAST -- msg:'XXXXXXX'  -- 表示广播发送一条信息  在某题集内广播，或在全局广播

JOIN_BATTLE -- msg:'XXXXX' --  进入某挑战  当客户端接收到该消息的时候更新战场局势
FIEE_BATTLE -- msg:'XXXXX' --  逃离挑战  当客户端接收到该消息的时候更新战场局势

ANSWER_RIGHT -- sid:1 progress:5 -- 表示某人答题正确 当客户端接收到该消息的时候更新对应客户的进度
USE_PROPERTY -- sid:1 tosid:2 action:delay放慢速度 -- 表示用户1对用户2使用道具 将进度拖慢

BATTLE_OK -- sid:1 score:100 time:120 breakRecord:true record:99
-- 表示用户1挑战成功以及其成绩和用时 record为该题集的记录 breakRecord为true表示破记录

BREAK_RECORD -- sid:1 score:100 record:99 -- 表示用户1以得分100破了最高记录99  在某题集内广播

JOIN_STORE -- qsid:88 sid:1 -- 表示用户1进入题集88 在全局广播
FIEE_STORE -- qsid:88 sid:1 -- 表示用户1退出体积88 在全局广播

CHALLENGE -- sid:1 tosid:2 -- 表示用户1向用户2发起挑战

C -> S
READY -- sid:1  -- 发送参数 表示客户端准备好了
START_BATTLE -- bid:1 -- 表示战场1开始战斗，由战场创建人点击开始按钮
-->
