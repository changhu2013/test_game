

mybattles_controller = function($scope, $http) {

    $scope.battles = [];

    $scope.showBattleMore = false;
    $scope.skipBattle = 0;
    $scope.limitBattle = 10;

    var loadBattlesCallback = function (data) {
        if (data instanceof Array) {
            //处理时间
            for(var i = 0, len = data.length; i < len; i++){
                var b = data[i];
                if(b.start){
                    b.start = moment(b.start).from();
                }
                if(b.end){
                    b.end = moment(b.end).from();
                }
            }

            $scope.skipBattle = $scope.skipBattle + data.length;
            $scope.battles = $scope.battles.concat(data);

            if (data.length < $scope.limitBattle) {
                $scope.showBattleMore = false;
            }else {
                $scope.showBattleMore = true;
            }
        }
    };

    var loadBattles = function(){
        $http({
            url : '/battle/mybattles',
            method : 'POST',
            params: {
                skip: $scope.skipBattle,
                limit: $scope.limitBattle
            },
            cache : false,
            timeout : 3000
        }).success(loadBattlesCallback);
    };

    $scope.moreBattle = function(){
        loadBattles();
    };

    loadBattles();
};