define(["app",
	"underscore",
	"cookie",
	"service-user"
	],function(app,_,cookie){
	app.directive("lmhome",["$rootScope","$location","$routeParams","lmUserService",
		function($rootScope,$location,$routeParams,userService){
			return {
				retrict:"E",
				templateUrl:"../directive/html/home.html",
				link:function($scope,$elememt,$attrs){
					$scope.keyword = "";
					$scope.linkTo = function(path){
						if(path=='/goodslistpage'){
							var path = "/goodslistpage/"+JSON.stringify({keyword:$scope.keyword.replace('/','')});
							$location.path(path);
						}else{
							$location.path(path);
						}
					};
					$scope.keydown = function(e,type){
						if(e.keyCode==13){
							$scope.linkTo('/goodslistpage');
						}
					};

					var imgUrlArr = ["../image/home/index01.png","../image/home/index02.jpg","../image/home/index03.jpg"];
					$scope.imgUrl="../image/home/index01.png";
					var i=0;
					var tt = setInterval(function(){
						i++;
						if(i>2){
							i=0;
						}
						$scope.imgUrl = imgUrlArr[i];

						$scope.$apply();
					},3000);

				$scope.mobilefn=function(mobile){

					var mobileReg = /^1[34578]\d{9}$/;
					if (mobileReg.test(mobile)) {
						$scope.isMobile=false;
					}else{
						$scope.isMobile=true;
					}
				};
				$scope.pwfn=function(pw){
					var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$).{5,20}$/; //6-20位数字和字母组成
					if(pwdReg.test(pw)){
						$scope.isPw=false;
					}else{
						$scope.isPw=true;
					}
				};
				$scope.pwrepeatfn=function(pwrepeat){
					var pwdReg = /^(?![^a-zA-Z]+$)(?!\D+$).{5,20}$/; //6-20位数字和字母组成
					if (pwdReg.test(pwrepeat)&&$scope.pw==pwrepeat){
						$scope.isPwrepeat=false;
					}else{
						$scope.isPwrepeat=true;
					}
				};
				




				// 再次获取等待时间
				$scope.second = 0;
				// 验证码文字
				$scope.vercodebtntext = '获取短信验证码';
				//  获取(手机)验证码
				$scope.getvercode = function(){
					if($scope.second != 0){return; }

					var verType = 1; // 表示是注册
					var mobile = $scope.mobile;
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
					//if(!_.all(['mobile','vercode','pw','pwrepeat'],function(n){return $scope.validate(n);}) || !$scope.isChecked){return;};
					if($scope.isPwrepeat==true)
					{
						alert("密码有误（6-20位字母或数字）！");
						return;
					}
					if(!$scope.isChecked)
					{
						alert("请同意零猫用户协议！");
						return;
					}

					if($scope.pw==""||$scope.pwrepeat==""||$scope.vercode==""||$scope.mobile==""||$scope.url==""){
						alert("输入有误");
						return;
					}
					// reg
					var mobile = $scope.mobile;
					var email = '';
					var pwd = $scope.pw;
					var vercode = $scope.vercode;
					var userType = 1;
					var url=$scope.url;
					var code='2';
					//var userType = $scope.userType;
					userService.register(mobile,email,pwd,userType,vercode,url,code)
					.success(function(data,status){
				//		console.log(data);
						if(!data.errorCode){
							alert("注册成功");
							var path = "/loginpage";
							$location.path(path);
						}else{
							//console.log(data);
							alert("注册失败!"+data.errorMsg);
						}
					});


				};

			}
		}
	}])
});