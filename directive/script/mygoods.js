define([
	"app",
	'service-goods',
	'service-img',
	'directive-pager',
	'tool-batchsearchbtn',
	'tool-confirmlogin',
	'filter-goodsType'
	],function(app){
	app.directive('lmmygoods',['lmGoodsService','lmImgService',function(goodsService,imgService){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			// scope: {}, // {} = isolate, true = child, false/undefined = no change
			// controller: function($scope, $element, $attrs, $transclude) {},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			 restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			 templateUrl: '../directive/html/mygoods.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope,$element,$attrs) {
				// 
				$scope.data = null;
				
				$scope.pageIndex = 0;
				$scope.pageSize = 8;


				// 搜索
				$scope.search = function(){
					var barcode = $scope.barcode,
						name = $scope.keyword,
						type = $scope.type;
					var pageIndex = $scope.pageIndex,
						pageSize = $scope.pageSize;

					goodsService.goods(barcode,name,type,pageIndex,pageSize).
					success(function(data){
						$scope.data = data.data;
						$scope.totalCount = data.count;
						$scope.$emit('afterSearch',data);

						
					});
				};

				// 在'我的商品库'批量搜索
				$scope.mybatchsearch = function(barcodeList){
					goodsService.mybatchsearch(barcodeList)
					.success(function(data){
						console.log(data);
						$scope.data = data.data;
						$scope.totalCount = data.count;
						$scope.$emit('afterSearch',data);
					});
				};

				

				$scope.listen = function(){
					$scope.$on('pageIndexChanged',function(e,args){
						$scope.search();
					});

					// 搜索之后,调整页码
					$scope.$on('afterSearch',function(e,args){
						var data = args;
						$scope.pageCount = Math.floor((data.count + ($scope.pageSize - 1)) / $scope.pageSize);
					});

					// checker
					$scope.$on('afterSearch',function(e,args){
						var ids = _.map(args.data,function(n){return n.sku_id;});
						$scope.$emit('checker.setMetadata',ids);
					});

					$scope.$on('batchSearch.beforeSearch',function(e,args){
						var barcodeList = args;
						$scope.mybatchsearch(barcodeList);
					});
				};

				// 下载
				$scope.down = function(idList){
					idList = _.isArray(idList) ? idList : [idList];
					if(idList.length==0){return;}
					var list = _.map(idList,function(id){
						var item = _.find($scope.data,function(n){return n.sku_id == id;});
						var skuId = item.sku_id;
						var barcode = item.barcode;
						return {skuId:skuId,code:barcode};
					});
					imgService.getZipPro(list);
				};

				// 选择下载
				$scope.downChoose = function(){
					var idList = [];
					_.each($scope.checkids,function(v,k){
						v && idList.push(k);
					});
					$scope.down(idList);
				};





				$scope.listen();

				$scope.initCsvUploader();

				$scope.search();
			}
		};
	}]);
});