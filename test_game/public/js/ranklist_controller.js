

ranklist_controller = function($scope, $http, $routeParams){

    $scope.showRankMore = false;
    $scope.runkList = [];
    $scope.skip = 0;
    $scope.limit = 10;

    var loadRankListCallback = function(data){
        if (data instanceof Array) {
            //处理时间
            for(var i = 0, len = data.length; i < len; i++){
                var b = data[i];
                if(b.lastTime){
                    b.lastTime = moment(b.lastTime).from();
                }
            }
            $scope.skip = $scope.skip + data.length;
            $scope.runkList = $scope.runkList.concat(data);

            if (data.length < $scope.limit) {
                $scope.showRankMore = false;
            }else {
                $scope.showRankMore = true;
            }
        }
    };

    var loadRandList = function(){
        $http({
            url : '/ranklist',
            method : 'POST',
            params: {
                qsid : $routeParams.qs_id,
                skip: $scope.skip,
                limit: $scope.limit
            },
            cache : false,
            timeout : 3000
        }).success(loadRankListCallback);
    };

    $scope.moreRank = function(){
        loadRandList();
    };

    loadRandList();
}