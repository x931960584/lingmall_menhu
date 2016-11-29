define(["app",
		"directive-topbar",
		"directive-home",
		"directive-copyright"
	],function(app){
	app.controller("lmActivepageCtrl",["$scope","$rootScope","$location",function($scope,$rootScope,$location){
		$scope.toActivePage = function(){
			var path = "/";
			$location.path(path);
		}
	}]);
});