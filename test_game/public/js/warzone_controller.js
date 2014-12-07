/**
 * 某题集下整在进行的挑战
 * @param $scope
 * @param $http
 */
warzone_controller = function($scope, $http){
    $scope.battles = [];
    $http({
        url : '/battle/qstore',
        method : 'POST',
        params : {
            qsid : '1'
        },
        cache : false,
        timeout : 3000
    }).success(function(data){
        $scope.battles = data;
    });
};