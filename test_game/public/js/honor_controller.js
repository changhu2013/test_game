

honor_controller = function($scope, $http) {

    //显示更多按钮
    $scope.showMore = true;

    //荣誉榜用户列表
    $scope.users = [];
    $scope.skip = 0;
    $scope.limit = 10;

    var callback = function(data){
        if(data instanceof Array){
            if(data.length < $scope.limit){
                $scope.showMore = false;
            }
            $scope.skip = $scope.skip + data.length;
            $scope.users = $scope.users.concat(data);
        }
    };

    var load = function(){
        $http({
            url : '/honor/users',
            method : 'POST',
            params : {
                skip : $scope.skip,
                limit : $scope.limit
            },
            cache : false,
            timeout : 3000
        }).success(callback);
    };

    //初始加载
    load();

    //点击按钮加载【更多】
    $scope.more = function(){
        load();
    };

};