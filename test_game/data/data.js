//删除用户
db.dropUser("db_admin");

//创建数据库用户
db.createUser({
    user: 'db_admin',
    pwd: 'pass',
    roles: [{
        role: 'dbOwner',
        db: 'test_game'
    }]
});

//删除题目分类集合
db.questioncategorys.drop();
//创建题目分类集合
db.createCollection('questioncategorys');
//保存题目分类数据
db.questioncategorys.save({
    pid: '0',
    title: '根节点',
    isParent: true
});
  