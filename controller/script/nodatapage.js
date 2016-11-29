define(["app",
		"directive-topbar",
		"directive-home",
		"directive-copyright"
	],function(app){
	app.controller("lmNoDatapageCtrl",["$scope","$rootScope","$location",function($scope,$rootScope,$location){
		$scope.toActivePage = function(){
			var path = "/activepage";
			$location.path(path);
		}
	}]);
});