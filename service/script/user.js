// 用户模块
define([
	'app',
	'underscore',
	'cookie',
	'config'
	],
	function(app,_,cookie,config){
		app.service('lmUserService', ['$http',"md5",function($http,md5){
			var urlPrefix = config.userServiceUrl;
			var urlDict = {
				login:'/lingmall/oauth/access_token',
				register:"/lingmall/users/register",
				sendmobilecode:"/lingmall/sms/send",
				validationcode:" /lingmall/users/captcha"
			};

			_.each(urlDict,function(v,k){
				urlDict[k] = urlPrefix + v;
			});
			
			var methodDict = {
				post:'POST',
				get:'GET'
			};

			// 登陆
			this.login = function(username,pwd){
				return $http({
					url:urlDict.login,
					method:methodDict.post,
					data:{
						"username":username||'',
						"password":md5.createHash(pwd||''),
						// "password":pwd,
						"grant_type":"password",
						"client_id":"f3d259ddd3ed8ff3843839b",
						"client_secret":"4c7f6f8fa93d59c45502c0ae8c4a95b"
					}
				});
			};

			//注册
			this.register = function(mobile,email,pwd,userType,captcha,url,code){
				return $http({
					url:urlDict.register,
					method:methodDict.post,
					data:{
						"mobile":mobile,
						"email":email,
						"user_type":userType,
						"password":md5.createHash(pwd),
						"captcha":captcha,
						"url":url,
						"code":code
					}
				});
			};

			//退出
			this.logout = function(){
				cookie.remove("token");
				cookie.remove('username');
				cookie.remove('pwd');
			};

			/*"account": "18637633325",
  			"type": "1=>注册; 2=>重置密码"*/

			//发送手机验证码
			this.sendmobilecode = function(account,type){
				return $http({
					url:urlDict.sendmobilecode,
					method:methodDict.post,
					data:{
						"account":account,
						"type":type
					}
				})
			};

			/*{
			  "captcha": "123456",
			  "mobile": "15618688068",
			  "type": "1=>注册; 2=>重置密码"
			}*/

			//验证 验证码
			this.validationcode = function(captcha,mobile,type){
				return $http({
					url:urlDict.validationcode,
					method:methodDict.post,
					data:{
						"captcha":captcha,
						"mobile":mobile,
						"type":type
					}
				})
			};

			this.token = function(token){
				if(token === undefined){
					// return cookie.get('token');
					return cookie.get('token');
				}else{
					cookie.set('token',token);
				}
			};


			this.get = cookie.get.bind(cookie);
			this.set = cookie.set.bind(cookie);

		}]);
	}
);