define(["app",
		"config",
		"tool-checker",
		"service-user",
		"service-goods"
	],function(app,config){
	app.directive("lmsettlement",["lmUserService","lmGoodsService",function(userService,goodsService){
		return {
			restrict:"E",
			scope:{},
			templateUrl:"../directive/html/settlement.html",
			link:function($scope,$element,$attrs){

				$scope.$on("settlement",function(e,args){
					$scope.orderNo = args.orderNo;
				});
				
				//去结算 跳转支付宝页面
				$scope.confirm = function(){
					//清除 localStorage
					localStorage.removeItem("orderNo");
					localStorage.removeItem("orderData");

					fn();

				};
				//post提交 跳转支付宝页面
				var callbackUrl = window.location.href;
				var fn = function(){
					var action = config.payServiceUrl+'/lingmall/pay';
					var form = $('<form/>').attr({
						action:action,
						method:'post',
						enctype:'application/json',
						target:'_blank'
					});

					var appendValue = function(name,value){
						var input = $('<input/>').attr('name',name).val(value);
						form.append(input);
					};
					appendValue('access_token',userService.token());
					appendValue('orderNo',$scope.orderNo);

					form[0].submit();
				};

				//fn();
			}
		}
	}]);
});