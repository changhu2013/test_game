

main_controller = function($scope, $http) {

    //显示题目树标记
    $scope.showQuestionTreeFlag = true;

    //题目集
    $scope.questionstores = [];

    //显示题目树
    $scope.showTreeView = function(){
        //修改显示题目树标记
        $scope.showQuestionTreeFlag = !$scope.showQuestionTreeFlag;

        var onMouseDown = function(event, eid, node){
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