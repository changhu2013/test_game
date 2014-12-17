battle_controller = function($scope, $http, $timeout, $routeParams){
    $scope.battleStatu = false;
    $scope.showBtn = true;
    $scope.showToolbar = false;
    $scope.users = [];
    $scope.toolNum = 0;

    var task;

    //初始化战场
    $timeout(function () {
        $http({
            url : '/battle/initBattleData',
            method : 'POST',
            params : {
                qsid : $routeParams.qs_id,
                bid: $routeParams.bid || $scope.bid
            },
            cache : false,
            timeout : 3000
        }).success(function (data) {
            for(var p in data){
                var user = {};
                user = data[p];
                user['sid'] = p;
                $scope.users.push(user);
            }
        });
    }, 200);

    //当监听到加入战场命令
    socket.on(Command.JOIN_BATTLE, function (data) {
        $scope.users = [];
        $scope.$apply(function () {
            for(var p in data){
                var user = {};
                user = data[p];
                user['sid'] = p;
                $scope.users.push(user);
            }
            if($scope.users.length >= 1){
                $scope.battleStatu = true;
            }
        });
    });

    //点击开始战斗的按钮
    $scope.startBattle = function () {
        $http({
            url: '/battle/startBattleForCreater',
            method: 'POST',
            params : {
                qsid : $routeParams.qs_id,
                bid: $scope.bid
            },
            cache : false,
            timeout : 3000
        }).success(function (data) {
            $scope.showBtn = false;
            $scope.showToolbar = true;

            //计时器,提交答案的时候计时器要暂停
            task = setInterval(function () {
                $scope.$apply(function () {
                    $scope.timer++;
                });
            }, 1000);

            for(var i= 0,len=data.length;i<len;i++){
                var question = data[i];
                var opts = [];
                for(var attr in question['opts']){
                    opts.push({
                        answer: attr,
                        text: question['opts'][attr]
                    });
                }
                question['opts'] = opts;
            }
            $scope.questionBattleData = data;
        });
    };

    socket.on(Command.START_BATTLE, function () {
        $http({
            url: '/battle/startBattle',
            method: 'POST',
            params : {
                qsid : $routeParams.qs_id,
                bid: $scope.bid
            },
            cache : false,
            timeout : 3000
        }).success(function (data) {
            $scope.showToolbar = true;
            //计时器,提交答案的时候计时器要暂停
            task = setInterval(function () {
                $scope.$apply(function () {
                    $scope.timer++;
                });
            }, 1000);

            for(var i= 0,len=data.length;i<len;i++){
                var question = data[i];
                var opts = [];
                for(var attr in question['opts']){
                    opts.push({
                        answer: attr,
                        text: question['opts'][attr]
                    });
                }
                question['opts'] = opts;
            }
            $scope.questionBattleData = data;
        });
    });


    $scope.questionIndex = 1; //题目序号
    $scope.timer = 1; //定时器


    var oTips = $('.tips');

    var oQuestionOpt;
    var validateAnswer = function (res) {
        task = setInterval(function () {
            $scope.$apply(function () {
                $scope.timer++;
            });
        }, 1000);
        var battleData = res.battleData;
        if(res.success){
            oTips.css('height', '2em').text('答案正确');
            setTimeout(function () {
                oTips.css('height', '0').text('');
            }, 1000);
            $('.user-item .current').css({
                width: (parseFloat(battleData.progress) * 100) + '%'
            });
        } else {
            oTips.css('height', '2em').text('答案错误');
            setTimeout(function () {
                oTips.css('height', '0').text('');
            }, 1000);
        }

        oQuestionOpt.filter('.selected').closest('.questions-item').remove();
        oQuestionOpt.removeClass('selected');

        if(battleData['status'] == 'C'){
            if(battleData.progress >= 0.6){
                oTips.css('height', '2em').text('挑战成功');
                setTimeout(function () {
                    oTips.css('height', '0').text('');
                }, 1000);
            } else {
                oTips.css('height', '2em').text('挑战失败');
                setTimeout(function () {
                    oTips.css('height', '0').text('');
                }, 1000);
            }
            clearInterval(task);
            return ;
        }
        $scope.questionIndex++;
    }

    //点击提交
    $scope.doReply = function(){
        oQuestionOpt = $('.questions-opt');
        if(oQuestionOpt.hasClass('selected')){
            clearInterval(task);
            $http({
                url: '/question/valianswer',
                method: 'POST',
                params: {
                    _id: oQuestionOpt.filter('.selected').data('_id'),
                    answer: oQuestionOpt.filter('.selected').data('answer'),
                    bid: $scope.bid,
                    qs_id: $routeParams.qs_id
                },
                cache: false,
                timeout: 3000
            }).success(validateAnswer);
        }
        return false;
    };

    $scope.doSelectAnswer = function (target) {
        var oQuestionOpt = $('.questions-opt');
        oQuestionOpt.removeClass('selected');
        $(target).addClass('selected');
    }

    //退出or逃跑
    $scope.goOutBattle = function () {
        $http({
            url: '/question/gooutbattle',
            method: 'POST',
            params: {
                bid: $scope.bid
            },
            cache: false,
            timeout: 3000
        }).success(function () {
            $location.path('/main');
        });
    }

    socket.on(Command.BATTLE_NEWS, function (data) {
        var type = data.type;
        var user = data.user;
        if(type == 'STATUS'){ //状态
            if(user.status == 'C'){ //完成
                var aUserItems = $('.user-item');
                if(user.progress >= 0.6 ){
                    aUserItems.find('[data-sid="' + user.sid + '"]').find('p i').text('(挑战成功)');
                } else {
                    aUserItems.find('[data-sid="' + user.sid + '"]').find('p i').text('(挑战失败)');
                }
            } else if(user.status == 'E') { //逃跑
                var aUserItems = $('.user-item');
                aUserItems.find('[data-sid="' + user.sid + '"]').find('p i').text('(逃跑)');
            }
        } else if (type == 'PROGRESS'){ //进度
            var aUserItems = $('.user-item');
            aUserItems.find('[data-sid="' + user.sid + '"]').find('.mask').css({
                width: (parseFloat(user.progress) * 100) + '%'
            });
        } else if (type == 'PROPERTY'){ //道具
            if(user.sid == $scope.user.sid){
                $scope.$apply(function () {
                    $scope.toolNum = user.property;
                });
            }
        }
    });

    socket.on(Command.BATTLE_OK, function (data) {
        $scope.battleIsEnd = true;
        var userData = data[$scope.user.sid];
        $scope.$apply(function () {
            if(userData.battsucc){ //成功
                $scope.battleCom.text = '胜利';
            } else { //不成功
                $scope.battleCom.text = '失败';
            }
            $scope.battleCom.grade = userData.grade;
        });

    });
};