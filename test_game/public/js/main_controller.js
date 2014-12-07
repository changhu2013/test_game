

main_controller = function($scope, $http, $timeout) {
    socket.on('new connect', function(m){
        $scope.msg = m;
        $scope.tipHeight = '2em';
        $timeout(function () {
            $scope.tipHeight = '0';
            $scope.msg = '';
        }, 2000);
    });

    //显示题目树标记
    $scope.showQuestionTreeFlag = false;

    //最近挑战
    $scope.lastBattles =[];

    //发送请求获取最近挑战
    $http({
        url : '/battle/finished',
        method : 'POST',
        cache : false,
        timeout : 3000
    }).success(function(data){
        $scope.lastBattles = data;
    });

    //题目集
    $scope.questionstores = [];

    //显示题目树
    $scope.showTreeView = function(){
        //修改显示题目树标记
        $scope.showQuestionTreeFlag = !$scope.showQuestionTreeFlag;

        var onMouseDown = function(event, eid, node){
            if(node){
                $http({
                    url : '/question/store',
                    method : 'POST',
                    params : {
                        qcid : node.qcid
                    },
                    cache : false,
                    timeout : 3000
                }).success(function(data){
                    $scope.questionstores = data;
                });
            }
        };
        var setting = {
            async: {
                enable: true,
                type: 'POST',
                dataType : 'json',
                url:'/question/category',
                autoParam:['pid', 'qcid']
            },
            data : {
              key : {
                  name : 'title'
              }
            },
            callback : {
                onMouseDown : onMouseDown
            }
        };

        $.fn.zTree.init($("#questioncategory"), setting);
    };
};