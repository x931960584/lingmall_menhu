define(["app",
		"directive-headbar",
		"directive-leftsidebar",
		"directive-topbar",
		"directive-datacenter",
		"directive-batchsearch",
		'tool-checker',
		"directive-copyright"
	],function(app){
	app.controller("lmDatacenterpageCtrl",["$scope",function($scope){

		$scope.$on("batchSearchPage",function(e,args){
			args.batchSearchPage = $scope.batchSearchPage;
			$scope.batchSearchPage = true;
		});

		$scope.$on("goback",function(e,args){
			$scope.batchSearchPage = false;
		});
		
	}]);
});