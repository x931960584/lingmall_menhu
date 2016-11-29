define(["app",
	'async',
	'underscore',
	'service-goods',
	'service-user',
	"directive-settlement",
	"tool-confirmlogin",
	'tool-checker'
	],function(app,async,_){
	app.directive("lmcashierdesk",['$routeParams','lmGoodsService','lmUserService',function($routeParams,goodsService,userService){
		return {
			restrict:"E",
			templateUrl:"../directive/html/cashierdesk.html",
			link:function($scope,$element,$attrs){
				$scope.orderNo = $routeParams.orderNo;

				$scope.pageIndex = 0;
				$scope.pageSize = 8;

				// 获取订单内容
				$scope.getOrder = function(){
					var orderNo = $scope.orderNo;
					var pay_status = '';
					var pageIndex = 0;
					var pageSize =1;

					goodsService.orderInShopcart(orderNo)
					.success(function(data){
						console.log(data);
						$scope.data = data.data;
						// sku数量
						$scope.totalCount = data.count;
						// 总价格

						$scope.totalPrice = _.reduce(data.data,function(mem,n){return mem+(n.price-0);},0).toFixed(2);
								//跳转支付宝传递事件
						$scope.$broadcast("settlement",{orderNo:$scope.orderNo});
					});
				};

				$scope.more = function(){
					$scope.pageSize *= 2;
				};

				$scope.listen = function(){
					
				};

				$scope.listen();

				$scope.getOrder();
			}
		};
	}]);
});