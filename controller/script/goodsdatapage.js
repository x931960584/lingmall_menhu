define(["app",
	    /*"directive-topmenu",
		"directive-title",
		"directive-bigsearchbox",
		"directive-mainmenu",
		"directive-goodslist",*/
		"directive-topbar",
		"directive-goodsdata",
		"directive-pager",
		"directive-copyright"
	],function(app){
		app.controller("lmGoodsdatapageCtrl",["$scope",
			"$routeParams",
			"lmImgService",function($scope,$routeParams,imgService){
				console.log("categoryId",$routeParams.categoryId);
				$scope.categoryId = $routeParams.categoryId;
		}]);
})