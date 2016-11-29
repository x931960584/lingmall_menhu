define(["app",
	'config',
	"service-util",
	"service-user"
	],function(app,config){
	app.directive("lmlogin",['$rootScope','$location',"lmUserService","lmUtilService",function($rootScope,$location,userService,utilSerice){
			return {
				restrict:"E",
				templateUrl:"/directive/html/login.html",
				link:function($scope,$element,$attrs){
					var backendUrl = config.backendUrl;
					$scope.username = userService.get('username');
					// $scope.pwd = userService.get('password');
					$scope.pwd = '';

					//登录
					$scope.login = function(){
						if(!$scope.username || !$scope.pwd){return;};
							
						userService.login($scope.username,$scope.pwd)
						.success(function(data){
							//console.log("login",data);
							if(data.role_id!=2){
								// 运营或者视觉提供商
								data.username = $scope.username;
								var fullUrl = backendUrl+"?info="+encodeURI(JSON.stringify(data));
								//console.log('fullUrl->',fullUrl);
								location.href =fullUrl;
								return;
							}

							$scope.$emit('afterLogin',data);

							$rootScope.isLogin = true;
							$rootScope.username = $scope.username;

							$location.path('/datacenterpage');
						})
						.error(function(err,status,data){
							alert("error","状态码",status);
						});
					};
					//键盘事件
					$scope.keydown = function(e){
						if(e.keyCode==13){
							$scope.login();
						}
					};

					$scope.linkTo = function(path,flag){
						utilSerice.linkTo(path,false);
					};

					$scope.listen = function(){
						// 记录token
						// 记录username和password(没有被md5过)
						$scope.$on('afterLogin',function(e,data){
							userService.token(data.access_token);

							userService.set('username',$scope.username);
							userService.set('password',$scope.pwd);
						});
					};

					$scope.goReg = function(){
						$location.path("/registerpage");
					};

					$scope.listen();
				}
			}

	}]);

});