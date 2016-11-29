define(["app","con-const","service-user"],function(app){
	app.directive("lmregister",["lmrege","lmUserService",function(rege,userService){
		return {
			restrict:"E",
			templateUrl:"../directive/html/register.html",
			link:function($scope,$element){
				// step 
				$scope.step = 1;
				// notice状态
				$scope.notice = {
					pw : -1,
					pwrepeat:-1,
					mobile:-1,
					vercode:-1,
					name:-1,
					agreement:-1
				};
				// show tip for user
				$scope.showdefaultnotice = function(name){
					$scope.notice[name] = 0 ;
				};

				// 验证字典
				var validateMap = {
					mobile:function(value){
						return rege.mobile.test(value);
					},
					vercode:function(value){
						return /\d{6}/.test(value);
					},
					pw:function(value){
						return rege.password.test(value);
					},
					pwrepeat:function(value){
						return rege.password.test(value) && $scope.data.pw == value;
					}
				};

				// 验证
				$scope.validate = function(name){
					var data = $scope.data[name];
					var flag = validateMap[name](data);
					$scope.notice[name] = flag ? 1 : 2;
					return flag;
				};
				// 数据
				$scope.data = {
					mobile:null,
					pw:null,
					pwrepeat:null,
					vercode:null,
					url:null,
					code:null,
				};



				// 再次获取等待时间
				$scope.second = 0;
				// 验证码文字
				$scope.vercodebtntext = '获取短信验证码';
				//  获取(手机)验证码
				$scope.getvercode = function(){
					if($scope.second != 0){return; }

					var verType = 1; // 表示是注册
					var mobile = $scope.data.mobile;
					userService.sendmobilecode(mobile,verType)
					.success(function(data){
						//console.log(data);

						if(data.code!=200){return; }

						$scope.second = 60;
						var t = setInterval(function(){
							$scope.vercodebtntext = '({second})秒后,再次获取'
								.replace('{second}',$scope.second);
							$scope.second -=1;

							if($scope.second<=0){
								$scope.second = 0;
								$scope.vercodebtntext = '获取短信验证码';
								clearInterval(t);
							}
							$scope.$apply();
						},1000);
					});

				};

				// 是否同意零猫协议
				$scope.isChecked = false;

				// 注册
				$scope.reg = function(){
					// check all
					if(!_.all(['mobile','vercode','pw','pwrepeat','url'],function(n){return $scope.validate(n);}) || !$scope.isChecked){return;};
					
					// reg
					var mobile = $scope.data.mobile;
					var email = '';
					var pwd = $scope.data.pw;
					var vercode = $scope.data.vercode;
					var userType = 1;
					var url=$scope.data.url;
					var code='2';
					//var userType = $scope.userType;

					userService.register(mobile,email,pwd,userType,vercode,url,code)
					.success(function(data,status){
						console.log(data);
						if(!data.errorCode){
							$scope.step =2;
						}else{
							alert("注册失败!");
						}
					});


				};

			

				
				// $scope.RegistboxHeight=window.innerHeight-198;
				// window.onresize=function(){
				// 	$scope.RegistboxHeight=window.innerHeight-198;
				// 	$scope.$apply();
				// }
			}
		};
	}]);
});