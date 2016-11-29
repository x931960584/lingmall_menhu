define([
		"app",
		'directive-test'
	],
	function(app){
		app.controller('lmIndexCtrl', ['$scope', function($scope){
			$scope.name = 'dino';
		}]);
	}
);
