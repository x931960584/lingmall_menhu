define([
	"app",
	'underscore',
	'service-user',
	'con-const'
	],function(app,_){
	app.directive("lmconfirmlogin",['$rootScope','$location','lmUserService','lmrege',function($rootScope,$location,userService,rege){
		return {
			restrict:"A",
			link:function($scope,$element,$attrs){
				if(!$rootScope.isLogin || !$rootScope.username || $rootScope.username == ''){
					// try to login from cookies
					var username = userService.get('username');
					var password = userService.get('password');

					// rege
					if(!username || !password || !rege.username.test(username) || !rege.password.test(password)){
						$location.path("/loginpage");
					}

					userService.login(username,password)
					.success(function(data){
						userService.token(data.access_token);
						userService.set('username',username);
						userService.set('password',password);

						// set $rootScope
						$rootScope.isLogin = true;
						$rootScope.username = username;
					}).error(function(){
						$location.path("/loginpage");
					});
				}
			}
		};
	}]);
});