define(["app",
	'underscore',
	'service-goods',
	'service-user',
	"service-util",
	"directive-settlement",
	"tool-confirmlogin",
	'tool-checker'
	],function(app,_){
	app.directive("lmshopcart",['lmGoodsService','lmUserService',"lmUtilService",function(goodsService,userService,utilService){
		return {
			restrict:"E",
			templateUrl:"../directive/html/shopcart.html",
			link:function($scope,$element,$attrs){
				$scope.pageIndex = 0;
				$scope.pageSize = 8;

				$scope.selectedCount = 0;

				// 搜索
				$scope.search = function(){
					var pageIndex = $scope.pageIndex;
					var pageSize = $scope.pageSize;

					goodsService.shopcart(pageIndex,pageSize)
					.success(function(data){
						$scope.data = data.data;
						$scope.totalCount = data.count;
						$scope.freeCount = data.freeCount;
						//$scope.freeCount = 8;

						$scope.$emit('shopcart.afterSearch',data);

					});
				};

				// 获取更多
				// 在元数据上加载(其实是让pageSize*2)
				$scope.more = function(){
					$scope.pageSize *=2;
					$scope.search();
				};

				// 删除
				// list<{goodsId,db}>
				$scope.remove = function(id){
					// 如果不写list,则表示删除所有选择的项
					/*if(list === undefined){
						list = [];
						_.each($scope.checkids,function(v,k){
							if(!v){return;};

							var item = _.find($scope.data,function(n){return n.goodsId == k;});
							list.push({goodsId:item.goodsId,db:item.db});
						});
					}*/
					if(id === undefined){
						var list = [];
						_.each($scope.checkids,function(v,k){
							if(!v){return;}
							list.push(id);
						});
						$scope.idList = list.join(",");
					}else{
						$scope.idList = id;
					}

					goodsService.shopcartRemove($scope.idList)
					.success(function(data,status){
						if(status == 204){
							console.log('remove success');
							$scope.$emit('shopcart.afterRemove',data);
						}
					});
				};

				//去结算 生成订单 跳转收银台页面
				/*
					{
					    "access_token": "用户访问凭证",
					    "type": "购买类型,默认填1  metaData.type:1",
					    "shopcartId": "1,2  多个,分隔",
					    "count": "数量",
					    "money": "金额"
					}
				*/
				$scope.confirm = function(){
					//生成订单
					goodsService.createorders(1,$scope.shopcartId,$scope.selectedCount,$scope.selectedPrice)
					.success(function(data){
						console.log("createorders",data);
						$scope.createOrderData = data;

						if($scope.createOrderData.pay_status==1) {
							alert("购买成功！");
							utilService.linkTo("/mygoodspage", false);
						}else {
							$scope.orderNo = $scope.createOrderData.orderNo;

							utilService.linkTo("/cashierdeskpage/" + $scope.orderNo, false);
						}
					});
				};

				$scope.listen = function(){
					// 删除之后,要刷新页面
					$scope.$on('shopcart.afterRemove',function(){
						$scope.pageSize = 8;
						$scope.search();
					});

					// checker
					$scope.$on('shopcart.afterSearch',function(e,args){
						var ids = _.map(args.data,function(n){return n.id;});
						$scope.$emit('checker.setMetadata',ids);
					});

					// 搜索之后,要更新checkids
					$scope.$on('shopcart.afterSearch',function(e,args){
						var data = args.data;
						var count = args.count;

						var last = $scope.checkids || {};
						$scope.checkids = {};
						_.each(data,function(d){
							$scope.checkids[d.id] = last[d.id] || false;
						});

						// 这里需要重新核实
						$scope.isAllChecked = $scope.count && _.all($scope.checkids,function(v,k){return v;});
					});

					// watch
					$scope.$watch('checkids',function(nv,ov){
						$scope.selectedCount = 0 ;
						$scope.selectedPrice = 0;

						$scope.barcodeList = [];
						$scope.shopcartIdArr = [];
						var priceArr = [];
						_.each(nv,function(v,k){
							if(v){
								$scope.selectedCount++;

								var item = _.find($scope.data,function(n){return n.id == k;}) ;
								priceArr.push(item.price);
								priceArr.sort(function(a,b){return a-b});

								if($scope.selectedCount>$scope.freeCount) {
									var pArr = priceArr.slice(0,$scope.selectedCount-$scope.freeCount);
									var p = eval(pArr.join("+"));
									$scope.selectedPrice = p;
									//$scope.selectedPrice += (item.price - 0).toFixed(2) - 0;
								}else {
									$scope.selectedPrice = 0.00;
								}

								$scope.barcode = item.barcode;
								$scope.goodsId = item.goodsId;
								$scope.sku_id = item.sku_id;

								$scope.shopcartIdArr.push(item.id);
								$scope.shopcartId = $scope.shopcartIdArr.join(",");
								//console.log("shopcartId",item,item.id);
								$scope.barcodeList.push({goodsId:$scope.goodsId,barcode:$scope.barcode,sku_id:$scope.sku_id});
							}
						});

						$scope.$broadcast("settlement",{
							barcodeList:$scope.barcodeList,
							selectedCount:$scope.selectedCount,
							selectedPrice:$scope.selectedPrice
						});
					},true);
				};

				$scope.listen();

				$scope.search();
			}
		}
	}]);
});