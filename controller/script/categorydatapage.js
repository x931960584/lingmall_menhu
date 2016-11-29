define(["app",
	"directive-headbar",
	"directive-topbar",
	"directive-categorydata",
	"directive-copyright"
	],function(app){
	app.controller("lmCategorydatapageCtrl",["$scope","$routeParams","lmImgService",
		function($scope,$routeParams,imgService){
			console.log($routeParams.categoryId);
 			$scope.categoryId = $routeParams.categoryId;
		}
	]);
});