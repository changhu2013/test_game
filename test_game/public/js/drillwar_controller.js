drillwar_controller = function($scope, $http, $location){
	$scope.questionIndex = 1; //题目序号
	var oTips = $('.tips');

	//点击提交
	$scope.doReply = function(){
		var validateAnswer = function (res) {
			var battleData = res.battleData;
			var usersData = battleData['users'];
			if(res.success){
				oTips.css('height', '2em').text('答案正确');
				setTimeout(function () {
					oTips.css('height', '0').text('');
				}, 1000);
				var aUserItems = $('.user-item');
				for(var p in usersData){
					var data = usersData[p];
					aUserItems.filter('[data-user-id="' + p + '"]').find('.item-layout .mask').css({
						height: (parseFloat(data.progress) * 100) + '%'
					})
				}
			} else {
				oTips.css('height', '2em').text('答案错误');
				setTimeout(function () {
					oTips.css('height', '0').text('');
				}, 1000);
			}

			var currentUserData = usersData[$scope.user.sid];
			if(currentUserData['statu'] == 'C'){
				if(currentUserData.progress >= 0.6){
					alert('挑战成功');
				} else {
					alert('挑战失败');
				}
				return ;
			}
			$scope.questionIndex++;
			oQuestionOpt.filter('.selected').closest('.questions-item').remove();
			oQuestionOpt.removeClass('selected');
		}
		
		if(oQuestionOpt.hasClass('selected')){
			$http({
				url: '/question/valianswer',
				method: 'POST',
				params: {
					_id: oQuestionOpt.filter('.selected').data('_id'),
					answer: oQuestionOpt.filter('.selected').data('answer'),
					bid: oQuestionOpt.filter('.selected').data('bid'),
					qs_id: $routeParams.qs_id
				},
				cache: false,
				timeout: 3000
			}).success(validateAnswer);
		}
		return false;
	};
	var oQuestionOpt = $('.questions-opt');
	oQuestionOpt.bind('click', function () {
		oQuestionOpt.removeClass('selected');
		$(this).addClass('selected');
	});

	//退出or逃跑
	$scope.goOutBattle = function (bid) {
		$http({
			url: '/question/gooutbattle',
			method: 'POST',
			params: {
				bid: bid
			},
			cache: false,
			timeout: 3000
		}).success(function () {
			$location.path('/main');
		});
	}
};