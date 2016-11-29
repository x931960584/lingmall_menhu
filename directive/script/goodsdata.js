define(["app",
	"underscore",
	"cookie",
	"async",
	// "directive-popupaddgoods",
	// "directive-popuplogin",
	"service-util"
	],function(app,_,cookie,async){
	app.directive("lmgoodsdata",[
		"$rootScope",
		"$location",
		"$routeParams",
		"lmImgService",
		"lmUserService",
		"lmUtilService",
		"lmGoodsService",
		function($rootScope,$location, $routeParams,imgService,userService,utilService,goodsService){
			return {
				restrict:"E",
				templateUrl:"../directive/html/goodsdata.html",
				link:function($scope,$element){
					$scope.currPage = 0;
					$scope.pageCount = 0;
					$scope.pageIndex = 0;
					$scope.pageSize = 10;
					$scope.checkids = [] ;
					$scope.params = JSON.parse($routeParams.params || "{}");
					$scope.data = {};
					
					//获取分类
					/*$scope.getCategory = function(next){
						goodsService.category()
						.success(function(data){
							$scope.categoryData = data.data;
							console.log("categorydata",data);
							next && next();
						})
					};

					$scope.getCategory();

					//获取分类
					$scope.renderData = function(){
						$scope.getCategory(function(){
							_.each($scope.categoryData,function(cate){
								$scope.getGoods(cate);
							});
						});
					};
					$scope.renderData();*/
					
					/*{
					  "access_token": "token,userId",
					  "level": "1 or 2 or 3 分类级别",
					  "catId": "分类ID",
					  "page": "页码",
					  "count": "条数",
					}*/
					//获取商品
					/*$scope.getGoods = function(cate){
						var opts = {
							access_token:userService.token(),
							level:1,
							catId:cate.id,
							page:0,
							count:10
						};
						goodsService.goodlist(opts)
						.success(function(data){
							$scope.data = data.data;
							console.log("goodsData",$scope.data);
						})
					};

					$scope.getGoods();
*/



					$scope.getThumbList = function(sourceData,next){
						var codelist = _.map(sourceData,function(n){return n.sku_id;});

		 				if(codelist && codelist.length>0){
			 				imgService.getThumb(codelist,function(err,data){
			 					if(data){
			 						_.each(data,function(n,i){
			 							sourceData[i].pic = n ? imgService.getFullurl(n.domain+"/"+n.key,500) : null;
			 						});
				 					$scope.$apply();
				 					next && next();
			 					}
			 				});
		 				}
		 			};

					$scope.linkToDetail = function(goodsId){
						utilService.linkTo("/productdetailpage/"+goodsId,true);
					};
					
					
					//进入二级分类
					$scope.toCategory = function(c){
					 	var id = c.id;
						$location.path("/categorydatapage/"+id);
					};


					//获取分类
					$scope.renderData = function(){
						$scope.getCategory(function(){
							_.each($scope.categoryData,function(cate){
								$scope.getGoodsByCategory(cate);
							});
						});
					};

					// 获取所有分类 
					$scope.getCategory = function(next){
						goodsService.category()
						.success(function(data){
							$scope.categoryData = data.data;
							next && next();
						});
					};

					// 根据某个分类来
					$scope.getGoodsByCategory = function(category){
						/*var opts = {
							access_token:userService.token(),
							level:1,
							catId:category.id,
							page:0,
							count:10
						};*/
						var catId = category.id;
						goodsService.goodlist(1,catId,$scope.pageIndex,$scope.pageSize)
						.success(function(data){
							var sourceData = data.data;
							$scope.data[category.id] = sourceData;
							$scope.getThumbList(sourceData);
						});
					};

					$scope.renderData();

					

					

					//更多分类
					$scope.seeMore =function(){
						$scope.isShowSeemore = true;
						$scope.isMoreHeight = true;
					};
					$scope.hideMore =function(){
						$scope.isShowSeemore = false;
						$scope.isMoreHeight = false;
					};
					
				}
			};

	}]);

});