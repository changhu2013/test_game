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

    //监听有人加入战场
    socket.on(Command.JOIN_STORE, function (data) {
        var warData = [];
        for(var p in data){
            var obj = {};
            obj['bid'] = p;
            obj['users'] = [];
            var users = data[p];
            for(var attr in users){
                var u = users[attr];
                u['sid'] = attr;
                obj['users'].push(u);
            }
            if(obj['users'].length >= 5) {
                obj['battlestatus'] = true;
                obj['battleText'] = '人数已满';
            } else {
                obj['battlestatus'] = false;
                obj['battleText'] = '';
            }
            warData.push(obj);
        }

        $scope.$apply(function(){
            $scope.battles = warData;
        });
    });


    //监听有战场开始战斗
    socket.on(Command.START_BATTLE, function (data) {
        $scope.$apply(function () {
            var bid = data.bid;
            var battles = $scope.battles;
            for(var p in battles){
                var battle = battles[p];
                if(battle['bid'] == bid){
                    battle['battlestatus'] = true;
                    battle['battleText'] = '正在进行';
                    return;
                }
            }
        });
    });
};