define(["app",
	"directive-headbar",
	"directive-topbar",	
	"directive-goodslist",
	"directive-pager",
	"directive-copyright"
], function(app) {
	app.controller("lmGoodslistpageCtrl", ['$scope', '$routeParams', function($scope, $routeParams) {
		var params = JSON.parse($routeParams.params||"{}");

		var keyword = params.keyword || '';

		setTimeout(function(){
			$scope.$broadcast('setBigbar',{keyword:keyword});
			
		},200);
	}]);
})