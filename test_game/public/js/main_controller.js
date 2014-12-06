

main_controller = function($scope, $http) {

    //显示题目树标记
    $scope.showQuestionTreeFlag = true;
    $scope.questions = [];

    //监听所选中的节点的变化
    var onNodeSelected = function(event, node){
        $http({
            method : 'POST',
            url : '/question/leaf',
            params : {
                id : node.id
            },
            cache : false,
            timeout : 30000
        }).success(function(data, status, headers, config){
            $scope.questions = data;
        });
    };
    //显示题目树
    $scope.showTreeView = function(){
        //修改显示题目树标记
        $scope.showQuestionTreeFlag = !$scope.showQuestionTreeFlag;
        $http({
            method : 'POST',
            url : '/question/tree',
            cache : false,
            timeout : 30000
        }).success(function(data, status, headers, config){
            $('#questiontree').treeview({
                bootstrap2: false,
                color : '#808080',
                showTags: true,
                levels: 2,
                data: data,
                onNodeSelected : onNodeSelected
            });
        });
    };
};