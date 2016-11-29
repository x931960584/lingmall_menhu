define(["app",
	"underscore",
	'async',
	"cookie",
	"service-img",
	"directive-shopcartbtn",
	"directive-minpager",
	"directive-pager",
	/*"directive-popuplogin",
	"directive-popupbuy",*/
	"service-util",
	'directive-select',
	'directive-catebar',
	'tool-checker',
	"tool-confirmlogin",
	"directive-modal"
	],function(app,_,async,cookie){
	app.directive("lmdatacenter",[
		// "$rootScope",
		// "$routeParams",
		// "$scope",
		"lmImgService",
		// "lmUserService",
		 "lmUtilService",
		"lmGoodsService",
		function(/*$rootScope,$routeParams,$scope,imgService,userService,*/imgService,utilService,goodsService){
			return {
				restrict:"E",
				templateUrl:"../directive/html/datacenter.html",
				link:function($scope,$element,$attrs){
					// 分类 
					$scope.firstCate = null;
					$scope.category = null;

					$scope.pageIndex = 0;
					$scope.pageSize = 16;


					$scope.data = null;
					// 被选择的"二级"分类的"值"
					$scope.selectedCategory = null;
					// 搜索出来的总数
					$scope.totalCount = null;

					// 被选择的商品的id字典
					$scope.checkids = {};
					// 是否全选
					$scope.isAllChecked = false;

					// 默认使用'类别'搜索
					$scope.isShowCatebar = false;

					// 搜索类别
					$scope.lastSearchType = null;
					$scope.searchType = null;

					// 关键字
					$scope.keyword = null;

					//批量搜索页面默认隐藏
					$scope.batchSearchPage = false;

					// 获取一级分类
					$scope.getCategory = function(cb){
						goodsService.category().
						success(function(data){
							//console.log(data);
							$scope.category = data.data;
							cb && cb();
						});
					};

					// // 获取二级分类
					// $scope.getSubTypes = _.debounce(function(cb){
					// 	goodsService.subCategory($scope.subCateId)
					// 	.success(function(data){
					// 		$scope.subTypes = data;
					// 		console.log(data);
					// 		cb && cb();
					// 	});
					// },200);

					// 通过关键字搜索
					$scope.searchByKeyword = _.debounce(function(){
						$scope.$emit('beforeSearch','keyword');

						var pageIndex = $scope.pageIndex;
						var pageSize = $scope.pageSize;
						var keyword = $scope.keyword;
						
						goodsService.search(keyword,pageIndex,pageSize)
						.success(function(data){
							$scope.data = data.data;
							$scope.totalCount =data.count;
							//console.log(data);

							$scope.$emit('afterSearchByKeyword',data);
							$scope.$emit('afterSearch',data);
						});
					},500);

					// 搜索
					$scope.searchByCate = _.debounce(function(){
						$scope.$emit('beforeSearch','cate');

						var level=2;
						var catId = $scope.selectedCategory.join(",");
						var pageIndex = $scope.pageIndex;
						var pageSize = $scope.pageSize;

						// 如果catId为空,那么搜索全部
						// 全部就是用上一级的catId去搜索
						if(catId==''){
							level = 1;
							catId = $scope.firstCate;
						}
						goodsService.goodlist(level,catId,pageIndex,pageSize)
						.success(function(data){
							$scope.data = data.data;
							$scope.totalCount =data.count;
							//console.log(data);

							$scope.$emit('afterSearchByCate',data);
							$scope.$emit('afterSearch',data);
						});
					},500);
					
					// 获取图片
					$scope.getImages = function(data){
						var skuidList = _.map(data,function(n){return n.sku_id;});
						if(skuidList.length==0){return;};

						imgService.getThumb(skuidList,function(err,parturlList){
							_.each(data,function(n,i){
								n.img = parturlList[i]?imgService.getFullurl([parturlList[i].domain,parturlList[i].key].join('/'),500):null;
							});
							$scope.$apply();
						});
					}

					// 加入购物车
					$scope.shopcartAdd = function(){
						var goodsIdList = _.map()
						var goodlist =[];
						_.each($scope.checkids,function(flag,goodsId){
							if(!flag){return; };

							var item = _.find($scope.data,function(d){return d.goodsId == goodsId;});
							goodlist.push({goodsId:item.goodsId, db:item.db });
						});
						goodsService.shopcartAdd(goodlist)
						.success(function(data,status){
							//console.log(data,status);
							if(status==204){
								$scope.$emit('shopcart.afterAdd');
							}
						});
					};

					// 查询购物车
					$scope.shopcart = function(){
						goodsService.shopcart(0,1)
						.success(function(data){
							$scope.shopcartTotalcount = data.count;
						});
					};

					//跳转搜索页面
					$scope.batchsearch = function(){
						$scope.$emit("batchSearchPage",{batchSearchPage:true});
					};

					//跳转商品详情页
					$scope.linkToDetail = function(goodsId){
						var path="/detailpage/"+goodsId+'/goodsinfo';
						utilService.linkTo(path,true);
					};

					$scope.listen = function(){
						// 如果搜索类型被改变,则从第1页开始搜索 
						$scope.$on('beforeSearch',function(e,args){
							$scope.lastSearchType = $scope.searchType;
							if($scope.lastSearchType != args){
								$scope.pageIndex = 0;
							}
							$scope.searchType = args;
							//console.log('beforeSearch',$scope.lastSearchType,$scope.searchType);
						});
						$scope.$on('afterSearch',function(e,args){
							$scope.lastSearchType = $scope.searchType;
						});

						$scope.$on('select.change',function(e,args){
							var name = args.name;
							var value = args.data;

							//console.log('select.change -> value',value);
							$scope.firstCate = value;

							if(name=='category'){
								var item = _.find($scope.category,function(n){return n.id == value;});
								var data = formatCategory(item.subset);
								var title = item.value;
								$scope.$broadcast('catebar.setMetadata',{name:'category',title:title,data:data});
							}

						});

						$scope.$on('catebar.change',function(e,args){
							var name = args.name;
							var selectedCategory = args.data;

							if(name=='category'){
								//console.log('selectedCategory',selectedCategory);
								$scope.selectedCategory = _.map(selectedCategory,function(n){return n.value;});
								$scope.searchByCate();
							}
						});

						// 获取图片
						$scope.$on('afterSearch',function(e,args){
							$scope.getImages(args.data);
						});

						// checker
						$scope.$on('afterSearch',function(e,args){
							var ids = _.map(args.data,function(n){return n.goodsId;});
							$scope.$emit('checker.setMetadata',ids);
						});

						// searchType切换
						$scope.$on('afterSearchByKeyword',function(e,args){
							$scope.$emit('changeSearchType','keyword');
						});
						$scope.$on('afterSearchByCate',function(e,args){
							$scope.$emit('changeSearchType','cate');
						});

						$scope.$on('changeSearchType',function(e,args){
							$scope.searchType = args;
							if($scope.searchType == 'cate'){
								$scope.isShowCatebar = true; // 显示'类别'选择框
								$scope.keyword =''; // 清空关键字搜索内容
							}else if($scope.searchType == 'keyword'){
								$scope.isShowCatebar = false;
							}
						});


						// pager
						$scope.$on('afterSearch',function(e,args){
							var totalCount = args.count;
							$scope.pageCount = Math.floor((totalCount + ($scope.pageSize - 1)) / $scope.pageSize);
						});

						$scope.$on('pageIndexChanged',function(e,args){
							if($scope.lastSearchType != $scope.searchType){
								return;
							}

							if($scope.searchType == 'cate'){
								$scope.searchByCate();
							}else if($scope.searchType == 'keyword'){
								$scope.searchByKeyword();
							}
						});

						// 购物车
						$scope.$on('shopcart.afterAdd',function(e,args){
							// 刷新下购物车的信息
							$scope.shopcart();
						});
					};

					$scope.listen();

					$scope.getCategory(function(){
						var data = formatCategory($scope.category);
						// data.unshift({value:0,text:'全部'});
						$scope.$broadcast('select.setMetadata',{name:'category',data:data});
					});

					$scope.shopcart();

					// 格式化category的信息
					// 使之成为{text:..,value:..}格式
					function formatCategory(data){
						return _.map(data,function(n){
							return {
								value:n.id,
								text:n.value
							};
						});
					};
				}
			};


		}]);
});