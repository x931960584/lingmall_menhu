define(["app",
		'async',
		"service-goods",
		"service-user",
		"directive-settlement",
		"tool-confirmlogin",
		"directive-pager"
	],function(app,async){
	app.directive("lmmyorders",["lmGoodsService","lmUserService",function(goodsService,userService){
		return {
			restrict:"E",
			templateUrl:"../directive/html/myorders.html",
			link:function($scope,$element,$attrs){
				$scope.pageIndex = 0;
				$scope.pageSize = 5;

				// //
				// $scope.$on("getOrderNo",function(e,args){
				// 	$scope.orderNo = args.orderNo;
				// });

				// //获取订单状态
				// $scope.getPaystatus = function(next){
				// 	goodsService.paystatus($scope.orderNo)
				// 	.success(function(data){
				// 		console.log("paystatus",data);
				// 		$scope.paystatusData = data;
				// 		$scope.paystatus = $scope.paystatusData.pay_status;
				// 		next && next();
				// 	});
					
				// };

				// 构建订单的状态字典
				$scope.statusDict = {};
				$scope.getStatus = function(next){
					var type =3;
					goodsService.metadata(3)
					.success(function(data){
						//console.log(data)
						_.each(data,function(n){
							$scope.statusDict[n.resid] = n.value;
						});
						next();
					});
				};

				//获取订单
				$scope.getOrders = _.debounce(function(){
					goodsService.myorders($scope.orderNo,$scope.paystatus,$scope.pageIndex,$scope.pageSize)
					.success(function(data){
						//console.log("orderData",data);
						$scope.orderData = data.data;

						$scope.$emit('afterSearch',data);
					});					
				},500);


				$scope.listen = function(){

					$scope.$on('afterSearch',function(e,args){
						var data = args;
						$scope.pageCount = Math.floor((data.count + ($scope.pageSize - 1)) / $scope.pageSize);
					});

					//换页刷新页面
					$scope.$on('pageIndexChanged',function(e,args){
						// $scope.getPaystatus($scope.getOrders);
						$scope.getOrders();
					});
				};

				$scope.listen();

				// $scope.getPaystatus($scope.getOrders);

				async.series([
					function(cb){
						$scope.getStatus(cb);
					}
				],function(err,data){
					$scope.getOrders();
					
				});
			}
		}
	}]);
});