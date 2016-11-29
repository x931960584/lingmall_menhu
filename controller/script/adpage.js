define(["app"
	],function(app){
	app.controller("lmAdpageCtrl",["$scope","$rootScope","$location",function($scope,$rootScope,$location){
		$scope.toRegPage = function(){
			var path = "/registerpage";
			$location.path(path);
		}
	}]);
});