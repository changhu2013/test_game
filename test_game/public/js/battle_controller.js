battle_controller = function($scope, $http, $routeParams){
    io.on(Command.JOIN_BATTLE, function () {
        alert(1);
    })
};