
drillwar_controller = function($scope, $http){
	$scope.doReply = function(){

		var validateAnswer = function (res) {
			if(res.success){
				alert('答案正确');
			} else {
				alert('答案错误');
			}
			oQuestionOpt.filter('.selected').closest('.questions-item').remove();
		}
		
		if(oQuestionOpt.hasClass('selected')){
			$http({
				url: '/question/valianswer',
				method: 'POST',
				params: {
					_id: oQuestionOpt.filter('.selected').data('_id'),
					answer: oQuestionOpt.filter('.selected').data('answer')
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
};