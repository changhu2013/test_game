/**
 * 某题集下整在进行的挑战
 * @param $scope
 * @param $http
 */
warzone_controller = function($scope, $http, $routeParams){



    $scope.battles = [];

    $scope.skip = 0;
    $scope.limit = 10;

    var doLoadCallback = function(data){

        if(data instanceof Array){

            $scope.skip = $scope.skip + data.length;

            $scope.battles = $scope.battles.concat(data);
        }
    };

    var doLoad = function(){
        $http({
            url : '/battle/getWarzoneData',
            method : 'POST',
            params : {
                qsid : $routeParams.qs_id,
                skip : $scope.skip,
                limit : $scope.limit
            },
            cache : false,
            timeout : 3000
        }).success(doLoadCallback);
    };

    doLoad();

    $scope.doMore = function(){
        doLoad();
    };

};