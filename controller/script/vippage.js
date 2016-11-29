define(["app",
		"directive-topbar",
		"directive-home",
		"directive-copyright"
	],function(app){
	app.controller("lmVippageCtrl",["$scope","$rootScope","$location",function($scope,$rootScope,$location){
		$scope.toRegPage = function(){
			var path = "/registerpage";
			$location.path(path);
		}
	}]);
});