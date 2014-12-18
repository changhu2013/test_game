main_controller = function ($scope, $http, $timeout) {
    
    //显示题目树标记
    $scope.showQuestionTreeFlag = false;

    //最近参加的挑战
    $scope.lastStoreBattles = [];

    //显示最近战区更多按钮
    $scope.showBattleMore = false;
    $scope.skipBattle = 0;
    $scope.limitBattle = 5;

    var loadBattlesCallback = function (data) {
        if (data instanceof Array) {
            //处理时间
            for(var i = 0, len = data.length; i < len; i++){
                var b = data[i];
                if(b.lastTime){
                    b.lastTime = moment(b.lastTime).from();
                }
            }

            if (data.length < $scope.skipBattle) {
                $scope.showBattleMore = false;
            }else {
                $scope.showBattleMore = true;
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

    //主动加载一次数据
    loadBattles();

    /**********************************************/

    //题目集
    $scope.questionstores = [];

    //当前选中的题目分类
    $scope.qcid = null;

    //题目集分页
    $scope.showStoreMore = false; //显示题目集更多按钮
    $scope.skipStore = 0;
    $scope.limitStore = 5;

    var loadStoreCallback = function (data) {
        if (data instanceof Array) {
            if (data.length < $scope.limitStore) {
                $scope.showStoreMore = false; //没有了, 隐藏更多按钮
            }else {
                $scope.showStoreMore = true;
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

        var loadStoreByNode = function(node){
            if(node){
                $scope.qcid = node.qcid;
                $scope.skipStore = 0;
                $scope.showStoreMore = false;
                $scope.questionstores = [];
                loadStore();
            }
        };

        var onMouseDown = function (event, eid, node) {
            loadStoreByNode(node);
        };

        var onClick = function(event, eid, node){
            if($scope.categoryTree && node){
                $scope.categoryTree.expandNode(node);
                loadStoreByNode(node);
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
            view: {
                showIcon: true, //是否显示图标
                showLine: true, //是否显示节点间连线
                showTitle: false,
                selectedMulti: false,
                txtSelectedEnable: false
            },
            callback: {
                onMouseDown: onMouseDown,
                onClick : onClick
            }
        };
        $scope.categoryTree = $.fn.zTree.init($("#questioncategory"), setting);
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