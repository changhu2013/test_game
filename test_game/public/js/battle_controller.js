battle_controller = function($scope, $http, $timeout, $location, $routeParams){
    var oTips = $('.tips');

    var alertText = function(text){
        oTips.css('height', '2em').text(text);
        setTimeout(function () {
            oTips.css('height', '0').text('');
        }, 1000);
    }

    $scope.battleStatu = false;
    $scope.showBtn = false;
    $scope.showToolbar = false;
    $scope.showTools = true;
    $scope.users = [];
    $scope.toolNum = 0;
    $scope.warId = $routeParams.qs_id;

    var autoTask; //自动退出的任务
    var task; //计时任务

    $scope.doInit = function () {
        //初始化战场
        $http({
            url : '/battle/initBattleData',
            method : 'POST',
            params : {
                qsid : $routeParams.qs_id,
                bid: $routeParams.bid || $scope.bid
            },
            cache : false
        }).success(function (data) {
            $scope.users = [];
            for(var p in data){
                var user = {};
                user = data[p];
                user['sid'] = p;
                $scope.users.push(user);
            }
            console.log('初始化战场数据:' + JSON.stringify(user));
        });
    }

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
            if($scope.users.length >= $scope.minBattleUser){
                $scope.battleStatu = true;
            }
        });
    });

    //点击开始战斗的按钮
    $scope.startBattle = function () {
        if($scope.users.length < $scope.minBattleUser){
            return;
        }
        $('#js-start-btn').remove();
        $http({
            url: '/battle/startBattleForCreater',
            method: 'POST',
            params : {
                qsid : $routeParams.qs_id,
                bid: $scope.bid,
                qstitle: $scope.qstitle
            },
            cache : false,
            timeout : 3000
        }).success(function (data) {
            if(data.success && data.success == false){
                alertText(data.msg);
                $location.path('/');
                return;
            }
            $scope.showBtn = false;
            $scope.showToolbar = true;
            task = setInterval(function () {
                $scope.$apply(function () {
                    $scope.timer++;
                    if($scope.timer >= parseInt($scope.timeOut)){ //超时自动提交
                        clearInterval(task);
                        timeOutBattle();
                    }
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

    //其他人监听到战斗开始
    socket.on(Command.START_BATTLE, function () {
        $('#js-start-btn').remove();
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
            task = setInterval(function () {
                $scope.$apply(function () {
                    $scope.timer++;
                    if($scope.timer >= parseInt($scope.timeOut)){ //超时自动提交
                        clearInterval(task);
                        timeOutBattle();
                    }
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

    var oQuestionOpt;
    var validateAnswer = function (res) {
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
            $scope.showTools = false;
            return ;
        }
        $scope.questionIndex++;
    }

    //点击提交
    $scope.doReply = function(){
        oQuestionOpt = $('.questions-opt');
        if(oQuestionOpt.hasClass('selected')){
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
                qsid: $routeParams.qs_id,
                bid: $scope.bid
            },
            cache: false
        }).success(function () {
            $location.path('#/warzone/' + $routeParams.qs_id);
        });
    };

    //挑战信息
    $scope.challText = '一次挑战不超过5个人';
    $scope.challData = {
        users: [],
        ids: []
    };
    $scope.doSearchUser = function () {
        var oSearchName = $('.search-wp input[name="search_name"]');
        if(!oSearchName.val()) return;
        $http({
            url: '/battle/searchUser',
            method: 'POST',
            params: {
                user: oSearchName.val()
            },
            cache: false
        }).success(function (res) {
            var result = res;
            for(var i= 0,len=res.length;i<len;i++){
                var user = res[i];
                $scope.challData.users.push(user.name);
                $scope.challData.ids.push(user.sid);
            }
            $scope.challText = $scope.challData.users.join(',');
            oSearchName.val('')
        });
    }

    $scope.toolStatus = false; //使用道具状态
    //点击使用道具
    $scope.useTool = function () {
        if($scope.toolNum > 0){
            $scope.toolStatus = true;
            $scope.toolCls = 'btn-primary';
        }
    }

    //被使用的状态
    $scope.toBeUsed = function (sid) {
        if(sid == $scope.user.sid){ //如果是对本人使用
            return;
        }
        if($scope.toolStatus){
            $http({
                url: '/battle/useTool',
                method: 'POST',
                params: {
                    tobesid: sid,
                    bid: $scope.bid,
                    qsid: $routeParams.qs_id
                },
                cache: false
            }).success(function (res) {
                $scope.toolStatus = false;
                $scope.toolCls = '';
                alertText('你使用拖后腿道具');
            });
        }
    }
    
    //挑战他们
    $scope.doChall = function () {
        if(!$scope.challData.ids.length){
            return;
        }
        $http({
            url: '/battle/doChallenger',
            method: 'POST',
            params: {
                ids: JSON.stringify($scope.challData.ids),
                qsid: $routeParams.qs_id,
                qstitle: $scope.qstitle
            },
            cache: false
        }).success(function (res) {
            clearInterval(autoTask);
            $scope.battleCom.showSucc = false;
        });
    }

    //战报(状态发生变化)
    socket.on(Command.BATTLE_NEWS, function (data) {
        var type = data.type;
        var user = data.user;
        var tobesid = data.tobesid;

        if(type == 'STATUS'){ //状态
            if(user.status == 'C'){ //完成
                var aUserItems = $('.user-item');
                aUserItems.find('[data-sid="' + user.sid + '"]').find('p i').text('(挑战完成)');
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
            if(tobesid == $scope.user.sid){ //被使者
                alertText(user.name + '对我使用拖后腿道具');
                $scope.showToolMask = true;
                $timeout(function () {
                    $scope.showToolMask = false;
                }, 2000);
            }
        }
    });

    //战斗结束
    socket.on(Command.BATTLE_OK, function (data) {
        $scope.$apply(function () {
            clearInterval(task);
            $scope.battleIsEnd = true;
            var userData = data['battleData'][$scope.user.sid];
            $scope.battleCom = {};
            if(userData.battsucc){ //成功
                $scope.battleCom.text = '胜利';
                $scope.battleCom.battleSucc = true;
                $scope.battleCom.showSucc = true;
                $scope.battleCom.index = userData.index;
                $scope.autoback = 60;
            } else { //不成功
                $scope.battleCom.text = '失败';
                $scope.battleCom.showSucc = false;
                $scope.battleCom.battleSucc = false;
                $scope.autoback = 10;
            }
            $scope.battleCom.grade = userData.grade || 0;
            $scope.battleCom.maxGrade = data.currentMaxGrade || 0;
            $scope.battleCom.historyGrade = data.historyRecord.grade || 0;
            $scope.battleCom.historyCreater = data.historyRecord.creater;

            $scope.showToolbar = false;

            autoTask = setInterval(function () {
                $scope.$apply(function () {
                    if($scope.autoback < 0){
                        $scope.autoback = 0;
                        clearInterval(autoTask);
                        return;
                    }
                    $scope.autoback--;
                    if($scope.autoback === 0){
                        $location.path('#/warzone/' + $routeParams.qs_id);
                    }
                });
            }, 1000);
        });
    });

    //离开战斗
    socket.on(Command.FIEE_BATTLE, function (data) {
        $scope.users = [];
        $scope.$apply(function () {
            for(var p in data){
                var user = {};
                user = data[p];
                user['sid'] = p;
                $scope.users.push(user);
                if($scope.users.length === 1 && p == $scope.user.sid){ //说明是第一个人
                    $scope.showBtn = true;
                }
            }
            if($scope.users.length >= 3){
                $scope.battleStatu = true;
            } else {
                $scope.battleStatu = false;
            }
        });
    });

    /**
     * 退出战斗
     * @param war
     */
    $scope.goToWar = function (war) {
        clearInterval(autoTask);
        $location.path('/warzone/' + war);
    }

    /**
     * 超时自动提交
     */
    function timeOutBattle(){
        $http({
            url: '/question/timeOutBattle',
            method: 'POST',
            params: {
                bid: $scope.bid,
                qs_id: $routeParams.qs_id
            }
        }).success(function (res) {
            alertText('超时自动提交');
        });
    }
};