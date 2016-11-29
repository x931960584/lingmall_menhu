define(["app",
	'tool-batchsearchbtn',
	"service-user",
	'service-goods'
	],function(app){
	app.directive("lmbatchsearch",["lmUserService",'lmGoodsService',function(userService,goodsService){
		return {
			restrict:"E",
			scope:{},
			templateUrl:"../directive/html/batchsearch.html",
			link:function($scope,$element,$attrs){
				$scope.pageIndex = 0 ;
				$scope.foundPageSize = 8;
				$scope.notfoundPageSize = 8;

				// 已经搜索过的barcode
				$scope.barcodeSearched = [];

				// 单个增加的barcode
				$scope.barcode =null;
				// 批量搜索的barcodeList
				$scope.barcodeList = [];

				// 显式的类型
				// 枚举'found','notfound'
				$scope.type = 'found';
				// 根据type筛选的数据
				$scope.subData = [];

				//
				$scope.foundData = [];
				$scope.notfoundData = [];

				//
				$scope.foundCheckids = {};
				$scope.notCheckids = {};

				// test
				// $scope.barcode = "6924254688781";
				
				//向上一级
				$scope.goback = function(){
					$scope.$emit("goback");
				};

				$scope.listen = function(){
					// 从file控件中读取了
					$scope.$on('batchSearch.beforeSearch',function(e,args){
						var barcodeList = args;
						//console.log('barcodeList',barcodeList);

						$scope.barcodeList = barcodeList;
						$scope.batchsearch();
					});

					// 刷新数据
					$scope.$on('refresh',function(){
						// $scope[$scope.type+'PageSize'] = Math.min($scope[$scope.type+'PageSize'],$scope[$scope.type+'Data'].length);
						$scope.subData = $scope[$scope.type+'Data'].slice(0,$scope[$scope.type+'PageSize']);

						//console.log($scope[$scope.type+'PageSize'],$scope.subData);
					});

					// checker
					$scope.$on('refresh',function(){
						var type = $scope.type;

						var last = $scope[type+'Checkids'];
						var ids = _.map($scope.subData,function(n){return n.barcode;});

						$scope.$broadcast('checker.setMetadata',ids);
						_.each(last,function(v,k){
							if(v && $scope.checkids[k]!==undefined){
								$scope.check(k);
							}
						});
						$scope[type+'Checkids'] = $scope.checkids;
					});

					$scope.$on('refresh',function(){
						$scope.totalCount = $scope.foundData.length + $scope.notfoundData.length;
					});

				};

				// 批量搜索
				$scope.batchsearch = function(){
					var barcodeList = $scope.barcodeList;
					barcodeList = $scope.filterBarcode(barcodeList);
					if(barcodeList.length==0){return;};

					goodsService.batchsearch(barcodeList)
					.success(function(data){
						//console.log('afterBatchsearch',data);

						alert("匹配到商品"+data.found.count+"个，未匹配到商品"+data.notfound.count+"个");

						$scope.foundData = $scope.foundData.concat(data.found.data);
						$scope.notfoundData = $scope.notfoundData.concat(data.notfound.data);

						$scope.$emit('afterBatchsearch',data);
						$scope.$emit('refresh');
					});
				};

				// 搜索
				$scope.search = function(){
					var barcodeList = [$scope.barcode];
					barcodeList = $scope.filterBarcode(barcodeList);
					if(barcodeList.length==0){return;};


					goodsService.batchsearch(barcodeList)
					.success(function(data){
						//console.log('afterSearch',data);
						data.found.count && $scope.foundData.unshift(data.found.data[0]);
						data.notfound.count && $scope.notfoundData.unshift(data.notfound.data[0]);

						$scope.$emit('refresh');
					});
				};

				// 展示更多数据
				$scope.more = function(){
					$scope[$scope.type+'PageSize'] *= 2;
					$scope.$emit('refresh');

				};

				// 删除
				$scope.remove = function(){
					$scope[$scope.type+'Data'] = _.filter($scope[$scope.type+'Data'],function(n){
						return !_.find($scope.checkids,function(v,k){
							return  v && n.barcode == k;
						});
					});

					$scope.barcodeSearched = _.filter($scope.barcodeSearched,function(n){
						return !_.find($scope.checkids,function(v,k){
							return v && n == k;
						});
					});

					$scope.$emit('refresh');
				};

				// 细节
				$scope.detail = function(){
					// todo
					// congcong
				};

				// 切换展示type
				$scope.changeType = function(type){
					$scope.type = type;
					$scope.$emit('refresh');
				};

				$scope.filterBarcode = function(barcodeList){
					var rst =[];
					_.each(barcodeList,function(n){
						if(!_.find($scope.barcodeSearched,function(nn){return nn==n;})){
							$scope.barcodeSearched.push(n);
							rst.push(n);
						}
					});
					return rst;
				};


				// 结算
				$scope.confirm = function(){};

				$scope.listen();

				

			}
		}
	}]);
});