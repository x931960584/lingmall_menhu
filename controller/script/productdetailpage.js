define(["app",
	"directive-headbar",
	"directive-topbar",
	"directive-productdetail",
	"directive-copyright"
	],function(app){
	app.controller("lmProductdetailpageCtrl",["$scope","$routeParams","lmImgService",
		function($scope,$routeParams,imgService){
			console.log($routeParams.goodId);
 			$scope.goodId = $routeParams.goodId;
		}
	]);
});