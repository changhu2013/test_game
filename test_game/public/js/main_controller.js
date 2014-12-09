main_controller = function ($scope, $http, $timeout) {

    //显示题目树标记
    $scope.showQuestionTreeFlag = false;

    //最近参加的挑战
    $scope.lastStoreBattles = [];

    //显示最近战区更多按钮
    $scope.showBattleMore = true;
    $scope.skipBattle = 0;
    $scope.limitBattle = 10;

    var loadBattlesCallback = function (data) {
        if (data instanceof Array) {
            if (data.length < $scope.skipBattle) {
                $scope.showBattleMore = false;
            }
            $scope.skipBattle = $scope.skipBattle + data.length;
            $scope.lastStoreBattles = $scope.lastStoreBattles.concat(data);
        }
    };

    //发送请求获取最近参加的战区
    var loadBattles = function () {
        $http({
            url: '/battle/laststore',
            method: 'POST',
            params: {
                skip: $scope.skipBattle,
                limit: $scope.limitBattle
            },
            cache: false,
            timeout: 3000
        }).success(loadBattlesCallback);
    };

    //点击最近挑战更多按钮
    $scope.moreBattle = function () {
        loadBattles();
    };

    /**********************************************/

    //题目集
    $scope.questionstores = [];

    //当前选中的题目分类
    $scope.qcid = null;

    //题目集分页
    $scope.showStoreMore = true; //显示题目集更多按钮
    $scope.skipStore = 0;
    $scope.limitStore = 1;

    var loadStoreCallback = function (data) {
        if (data instanceof Array) {
            if (data.length < $scope.limitStore) {
                $scope.showStoreMore = false; //没有了, 隐藏更多按钮
            }
            $scope.skipStore = $scope.skipStore + data.length;
            $scope.questionstores = $scope.questionstores.concat(data);
        }
    };

    //加载题目集
    var loadStore = function () {
        if ($scope.qcid != null) {
            $http({
                url: '/question/store',
                method: 'POST',
                params: {
                    qcid: $scope.qcid,
                    skip: $scope.skipStore,
                    limit: $scope.limitStore
                },
                cache: false,
                timeout: 3000
            }).success(loadStoreCallback);
        }
    };

    //显示题目树
    $scope.showTreeView = function () {
        //修改显示题目树标记
        $scope.showQuestionTreeFlag = !$scope.showQuestionTreeFlag;

        var onMouseDown = function (event, eid, node) {
            if (node) {
                $scope.qcid = node.qcid;
                $scope.skipStore = 0;
                $scope.showStoreMore = true;
                loadStore();
            }
        };
        var setting = {
            async: {
                enable: true,
                type: 'POST',
                dataType: 'json',
                url: '/question/category',
                autoParam: ['pid', 'qcid']
            },
            data: {
                key: {
                    name: 'title'
                }
            },
            callback: {
                onMouseDown: onMouseDown
            }
        };
        $.fn.zTree.init($("#questioncategory"), setting);
    };

    //更多题目集
    $scope.moreStore = function () {
        loadStore();
    };

    $scope.expandMenu = function () {
        if ($scope.expandClass) {
            $scope.expandClass = '';
            $scope.showPageHref = '';
        } else {
            $scope.expandClass = 'expand';
            $scope.showPageHref = true;
        }
    }

};