

//创建用户
/*
db.createUser({
    user: 'admin',
    pwd: 'pass',
    roles: [{
        role: 'dbOwner',
        db: 'test_game'
    }]
});
*/

//删除用户集合
db.users.drop();
//创建用户集合
db.createCollection('users');
//存入用户数据
db.users.save({
    sid: '1001',
    name: '张三1',
    job: '银行职员1'
});
db.users.save({
    sid: '1002',
    name: '张三2',
    job: '银行职员2'
});
db.users.save({
    sid: '1003',
    name: '张三3',
    job: '银行职员3'
});
db.users.save({
    sid: '1004',
    name: '张三4',
    job: '银行职员4'
});
db.users.save({
    sid: '1005',
    name: '张三5',
    job: '银行职员5'
});
db.users.save({
    sid: '1006',
    name: '张三6',
    job: '银行职员6'
});

//删除题目分类集合
db.questioncategorys.drop();
//创建题目分类集合
db.createCollection('questioncategorys');
//保存题目分类数据
db.questioncategorys.save({
    qcid: '10',
    pid: '0',
    title: '财务审计部',
    isParent: true
});

db.questioncategorys.save({
    qcid: '11',
    pid: '0',
    title: '市场客服部',
    isParent: true
});


db.questioncategorys.save({
    qcid: '12',
    pid: '0',
    title: '车队运营部',
    isParent: true
});
db.questioncategorys.save({
    qcid: '13',
    pid: '0',
    title: '安全监管部',
    isParent: true
});
db.questioncategorys.save({
    qcid: '13',
    pid: '0',
    title: '安全监管部',
    isParent: true
});
db.questioncategorys.save({
    qcid: '20',
    pid: '10',
    title: '财务会计',
    isParent: true
});
db.questioncategorys.save({
    qcid: '21',
    pid: '10',
    title: '财务会计',
    isParent: true
});
db.questioncategorys.save({
    qcid: '22',
    pid: '11',
    title: '客服开发',
    isParent: true
});
db.questioncategorys.save({
    qcid: '23',
    pid: '11',
    title: '客服代表',
    isParent: true
});
db.questioncategorys.save({
    qcid: '24',
    pid: '12',
    title: '调度主管',
    isParent: true
});
db.questioncategorys.save({
    qcid: '25',
    pid: '12',
    title: '车务主管',
    isParent: true
});
db.questioncategorys.save({
    qcid: '26',
    pid: '13',
    title: '押运员',
    isParent: true
});
db.questioncategorys.save({
    qcid: '27',
    pid: '13',
    title: '安全主任',
    isParent: true
});
db.questioncategorys.save({
    qcid: '30',
    pid: '24',
    title: '调度助理',
    isParent: true
});

db.questioncategorys.save({
    qcid: '31',
    pid: '25',
    title: '驾驶员',
    isParent: true
});
  