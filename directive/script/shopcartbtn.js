define(["app",
	'service-util'
	],function(app){
	app.directive("lmshopcartbtn",['lmUtilService',function(utilService){
		return {
			restrict:"E",
			templateUrl:"../directive/html/shopcartbtn.html",
			link:function($scope,$element,$attrs){
				$scope.linkTo = utilService.linkTo;
			}
		}
	}]);
});