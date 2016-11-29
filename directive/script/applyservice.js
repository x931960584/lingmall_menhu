define(["app",
	'underscore',
	'service-goods',
	'tool-confirmlogin'
	],function(app,_){
	app.directive("lmapplyservice",['$location','lmGoodsService',function($location,goodsService){
		return {
			restrict:"E",
			templateUrl:"../directive/html/applyservice.html",
			link:function($scope,$element,$attrs){
				// 服务类型
				$scope.typeDict = {};
				// 服务文字需求
				$scope.serviceDemand = '';

				$scope.selectType = function(type){
					$scope.typeDict[type] = !$scope.typeDict[type];
				};

				// 获取类型选择的元数据
				$scope.getTypeMetadata = function(){
					goodsService.metadata(goodsService.metadataTypeDict.serviceType)
					.success(function(data){
						//console.log('serviceType',data);
						$scope.serviceType = data;
					});
				};

				// 申请service
				$scope.apply = function(){
					var barcodeList = [];
					var typeList = [];
					_.each($scope.typeDict, function(v, k) {
						if (v) {
							typeList.push(k);
						}
					});
					var serviceDemand = $scope.serviceDemand;
					var contacts = {
						name:$scope.name,
						phone:$scope.phone,
						email:$scope.email
					};

					goodsService.serviceApply(barcodeList,typeList,serviceDemand,contacts)
					.success(function(data,status){
						if(status == 204){
							//console.log('apply success');
							$location.path("/auditmanagementpage");
						}
					});
				};

				$scope.getTypeMetadata();

			}
		}
	}]);
});