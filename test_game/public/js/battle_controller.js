battle_controller = function($scope, $http, $routeParams){
    $scope.battleStatu = false;
    $scope.users = [];
    !function initBattle(){
        $http({
            url : '/battle/initBattleData',
            method : 'POST',
            params : {
                qsid : $routeParams.qs_id,
                bid: $routeParams.bid
            },
            cache : false,
            timeout : 3000
        }).success(function (data) {
            for(var p in data){
                var user = {};
                user = data[p];
                user['sid'] = p;
                $scope.users.push(user);
            }
        });
    }();

    socket.on(Command.JOIN_BATTLE, function (data) {
        $scope.users = [];
        $scope.$apply(function () {
            for(var p in data){
                var user = {};
                user = data[p];
                user['sid'] = p;
                $scope.users.push(user);
            }
            if($scope.users.length >= 3){
                $scope.battleStatu = true;
            }
        });
    })
};