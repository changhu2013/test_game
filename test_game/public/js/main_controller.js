

main_controller = function($scope, $http) {

    //显示题目树标记
    $scope.showQuestionTreeFlag = true;

    //显示题目树
    $scope.showTreeView = function(){
        //修改显示题目树标记
        $scope.showQuestionTreeFlag = !$scope.showQuestionTreeFlag;

        function filter(treeId, parentNode, childNodes) {
            if (!childNodes) return null;
            for (var i=0, l=childNodes.length; i<l; i++) {
                childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
            }
            return childNodes;
        }

        var setting = {
            async: {
                enable: true,
                type: 'POST',
                dataType : "json",
                url:"/question/category",
                autoParam:["id", "name=n", "level=lv"],
                otherParam:{"otherParam":"zTreeAsyncTest"},
                dataFilter: filter
            }
        };

        $.fn.zTree.init($("#questioncategory"), setting);
    };
};