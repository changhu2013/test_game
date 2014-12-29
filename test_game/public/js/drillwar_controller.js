drillwar_controller = function($scope, $http, $location, $routeParams){
	$scope.questionIndex = 1; //题目序号
	var oTips = $('.tips');

	//点击提交
	$scope.doReply = function(){
		var validateAnswer = function (res) {
			var drillData = res.drillData;
			if(res.success){
				oTips.css('height', '2em').text('答案正确');
				setTimeout(function () {
					oTips.css('height', '0').text('');
				}, 1000);
				$('.user-item .current').css({
					width: (parseFloat(drillData.progress) * 100) + '%'
				});
			} else {
				oTips.css('height', '2em').text('答案错误');
				setTimeout(function () {
					oTips.css('height', '0').text('');
				}, 1000);
			}

			oQuestionOpt.filter('.selected').closest('.questions-item').remove();
			oQuestionOpt.removeClass('selected');

			if(drillData['status'] == 'C'){
				$scope.drillIsEnd =  true;
				$scope.currentScore = res.currentScore;
				if(drillData.progress >= 0.6){
					$scope.drillResult = '挑战成功,获得' + res.getScore + '积分';
				} else {
					$scope.drillResult = '挑战失败!';
				}
				return ;
			}
			$scope.questionIndex++;
		}
		
		if(oQuestionOpt.hasClass('selected')){
			$http({
				url: '/question/valianswer',
				method: 'POST',
				params: {
					_id: oQuestionOpt.filter('.selected').data('_id'),
					answer: oQuestionOpt.filter('.selected').data('answer'),
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
	
	$scope.keepPractice = function () {
		window.location.reload();
	}
};