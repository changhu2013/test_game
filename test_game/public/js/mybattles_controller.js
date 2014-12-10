

mybattles_controller = function($scope, $http) {

    $scope.battles = [];

    $http({
        url : '/mybattles',
        method : 'POST',
        cache : false,
        timeout : 3000
    }).success(function(data){
        $scope.battles = data;
    });

};