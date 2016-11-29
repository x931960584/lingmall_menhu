define(["app",
		"cookie"
	],function(app,cookie){
	app.directive("lmheadbar",['$rootScope',"$location","lmUserService","lmUtilService",function($rootScope,$location,userService,utilService){
		return {
			restrice:"E",
			templateUrl:"../directive/html/headbar.html",
			link:function($scope,$element,$attrs){
				$scope.isHomepage = false;
				//退出
				$scope.logout = function(){
					$rootScope.isLogin = false;
					userService.logout();
					$location.path("/homepage");
				};

				//
				$scope.linkTo = function(path){
					utilService.linkTo(path,false);
				};

				//判断是否在首页
				$scope.ishomepage = function(){
					var path = window.location.hash;
					//console.log(path);
					if(path=='#/loginpage'){
						$scope.isHomepage = true;
					}
				};

				$scope.goActive =function(){
					$location.path("/vippage");
				};

				$scope.ishomepage();
			}
		}
	}]);
});