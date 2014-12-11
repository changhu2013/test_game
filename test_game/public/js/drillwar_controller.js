drillwar_controller = function($scope, $http){
	$scope.questionIndex = 1; //题目序号
	$scope.timer = 1; //定时器
	//计时器,提交答案的时候计时器要暂停
	var task = setInterval(function () {
		$scope.$apply(function () {
			$scope.timer++;
		});
	}, 1000);

	var oTips = $('.tips');

	//点击提交
	$scope.doReply = function(){
		var validateAnswer = function (res) {
			task = setInterval(function () {
				$scope.$apply(function () {
					$scope.timer++;
				});
			}, 1000);
			if(res.success){
				oTips.css('height', '2em').text('答案正确');
				setTimeout(function () {
					oTips.css('height', '0').text('');
				}, 1000);
				var aUserItems = $('.user-item');
				var battleData = res.battleData;
				var usersData = battleData['users'];
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
			$scope.questionIndex++;
			oQuestionOpt.filter('.selected').closest('.questions-item').remove();
			oQuestionOpt.removeClass('selected');
		}
		
		if(oQuestionOpt.hasClass('selected')){
			clearInterval(task);
			$http({
				url: '/question/valianswer',
				method: 'POST',
				params: {
					_id: oQuestionOpt.filter('.selected').data('_id'),
					answer: oQuestionOpt.filter('.selected').data('answer'),
					bid: oQuestionOpt.filter('.selected').data('bid')
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
	$scope.goOutBattle = function () {
		$http({
			url: '/question/gooutbattle',
			method: 'POST',
			params: {
				bid: $scope.battle_bid
			},
			cache: false,
			timeout: 3000
		}).success(function () {
			
		});
	}
};