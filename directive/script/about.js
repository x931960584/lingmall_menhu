define(["app"],function(app){
	app.directive("lmabout",["$rootScope","$location",'$routeParams',
		function($rootScope,$location,$routeParams){
		return {
			restrict:"E",
			scope:true,
			templateUrl:"../directive/html/about.html",
			link:function  ($scope,$element,$attrs) {
				var location_url=['aboutus','contactus','useragreement'];
				var location_name=['关于我们','联系我们','用户注册协议'];
				
				var urlName = $routeParams.routeName;
				var index = location_url.indexOf(urlName);
				
				$scope.locationName=location_name[index];
				$scope.currentlocation=index;
				
				$scope.turnpage=function(locationName){
					$location.path('/aboutpage/'+locationName);
				}
			}
		};
	}]);
});