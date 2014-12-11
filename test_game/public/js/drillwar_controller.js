
drillwar_controller = function($scope, $http){
	$scope.doReply = function(){
		var validateAnswer = function (res) {
			if(res.success){
				alert('答案正确');
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
				alert('答案错误');
			}
			var questionIndex = $('#js-questionIndex').text();
			questionIndex = parseInt(questionIndex);
			$('#js-questionIndex').text(++questionIndex);
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
};