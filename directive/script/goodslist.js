define(["app",
	"underscore",
	"cookie",
	"service-img",
	"service-user",
	"service-util",
	"directive-pager"
	],function(app,_,cookie){
	app.directive("lmgoodslist",["$rootScope","$location","$routeParams","lmImgService","lmUserService","lmUtilService","lmGoodsService",
		function($rootScope,$location,$routeParams,imgService,userService,utilService,goodsService){
			return {
				restrict:"E",
				scope:{},
				templateUrl:"../directive/html/goodslist.html",
				link:function($scope,$element){
					// 变量初始值
					$scope.currPage = 0;
					$scope.pageIndex = 0;
					$scope.pageSize = 30;
					//$scope.pageCount = 0;
					$scope.checkids = [] ;
					$scope.categorySelectedArr=[];
					$scope.brandSelectedArr=[];
					$scope.params = JSON.parse($routeParams.params||"{}");
					//console.log("params",$routeParams.params);
					$scope.hasTypeid = !!$scope.params.type_id;
					$scope.showmore=0;
					$scope.locationName=$scope.params.keyword;
					// 执行全文关键词搜索、搜索翻页
					var _search = function(){
						$scope.keyword=$scope.params.keyword == '' ? " " : $scope.params.keyword;
						var opts = {
							keyword:$scope.keyword,
							page:$scope.pageIndex-0+1,
							count:$scope.pageSize
						};
						// var opts = _.extend(opts,$scope.params);
						//console.log("opts",opts);
						goodsService.search($scope.keyword,$scope.pageIndex,$scope.pageSize)
						.success(function(data){
							$scope.data = data.data;
							if($scope.data.length==0){
								var path = "/nodatapage";
								$location.path(path);
							}
							$scope.$emit("afterSearch",data);
							// 取缩略图
							$scope.getThumb();
						});
					};
                   	$scope.search = _.debounce(_search,100);
                   	//监视列表$scope.data变量的变化，翻页或者重新搜索后执行html高亮重写
					$scope.$watch("data",function(newValue,originValue){
						evallist();
					});
					//执行高亮重写
					function evallist(){
						var itemCount=angular.element('.goodname').length;		//使用angular选择器获取当前列表结果总数
						var html;
						var es=angular.element('.goodname');					//使用angular选择器获取当前列表待高亮处理的所有标签Dom
						var element;
						for(var i=0;i<itemCount;i++){
							element=angular.element(es[i]);
							html=$scope.data[i].name+'';						//读取对应的原有标签文本
							//console.log(html);
							html=html.replace(/(<em>)/g,'<a>');
							html=html.replace(/(<\/em>)/g,'</a>');
							//console.log(html);
							element.html(html);									//使用angular.element改写标签内容
						}
					}
					//获取物品分类
					/*$scope.toggleCategory = function(index){
						if(index=="none"){
							$scope.categorySelectedArr=[];
							return;
						}
						if($scope.categorySelectedArr.indexOf(index)>=0){
							$scope.categorySelectedArr = _.without($scope.categorySelectedArr,index);
						}else{
							$scope.categorySelectedArr.push(index);
						}
					};
					//获取物品品牌
					$scope.toggleBrand = function(index){
						if(index=="none"){
							$scope.brandSelectedArr=[];
							return;
						}
						if($scope.brandSelectedArr.indexOf(index)>=0){
							$scope.brandSelectedArr = _.without($scope.brandSelectedArr,index);
						}else{
							$scope.brandSelectedArr.push(index);
						}
					};*/
					//获取物品对应的缩略图第一张
					$scope.getThumb = function(){
						var codeList = _.map($scope.data,function(n){return n.sku_id;});
						if(codeList==""){
							return;
						}
						imgService.getThumb(codeList,function(err,data){
							_.each($scope.data,function(n,i){
								if(data[i])
								n.pic = imgService.getFullurl(data[i].domain+'/'+data[i].key,500);
							});
							$scope.$apply();
						});
					};

					//跳转至商品详情页面
					$scope.linkToDetail = function(goodsId){
						var item = _.find($scope.data,function(n){return n.goodsId == goodsId;});
						utilService.linkTo("/productdetailpage/"+goodsId,true);
					};
					//加入商品库
					$scope.batchAddMygood = function(){
						$scope.checkedgoods=$scope.checkedgoods||[];
						if($scope.checkedgoods.length==0){
							alert('请先勾选要购买的商品(SKU)！');
							return;
						}
						goodsService.addGoods($scope.checkedgoods)
						.success(function(data){
							$scope.$broadcast('toggleModal',{name:'addgoods',flag:true,updateInfo:{buyFlag:true}});
						})
						.error(function(err,code){
							if(code == 401 || code == 412){
								$scope.$broadcast('toggleModal',{name:'login',flag:true});
							}
							// console.log(arguments);
						});
						// $scope.$broadcast('toggleModal',{name:'buy',flag:true});
						// return;
						// var goodId = $scope.goodId;
						// requestservic_e.addMygood($scope.checkids,function(err,data) {
						// 	if(!err){
						// 		console.log('addMygood Success!');
						// 	}else{
						// 		//弹出登录框							
						// 		$scope.isLoginShow = true;
						// 		$scope.isLoginShowMask =true;
						// 		$scope.$apply();
						// 	}
						// });
						//弹出框							
						$scope.isShow = true;
						$scope.isShowMask =true	;
					};

					//监视已选择的商品数量变化
					$scope.$watch("checkids.length",function(nv){
						$scope.isCheckAll = !!(nv!=0 && nv == _getValidIds($scope.data).length);
					});
					//监视品牌筛选的变化
					$scope.$watch("brandSelectedArr",function(nv,ov){
						$scope.search();
						$scope.params.brand = nv.join(",");
					},true);
					//监视分类选择的变化
					$scope.$watch("categorySelectedArr",function(nv,ov){
						$scope.search();
						$scope.params.type_id = _.map(nv,function(n){return _.find($scope.categoryData,function(nn){return nn.id==n;}).id;}).join(",");
					},true);

					$scope.search();
					// 如果是通过分类进来,则需要展示"标签栏"
					if($scope.params.type_id){
						$scope.getTags($scope.params.type_id);
					}else{
						$scope.titleTip = $scope.params.keyword;
					}

					$scope.listen = function(){

						$scope.$on('afterSearch',function(e,args){
							var data = args;
							$scope.pageCount = Math.floor((data.count + ($scope.pageSize - 1)) / $scope.pageSize);
						});

						//换页刷新页面
						$scope.$on('pageIndexChanged',function(e,args){
							$scope.search();
						});
					};

					$scope.listen();
				}
			};
		// help
		// 获取可以被点击的id
		function _getValidIds(data){
			return _.map(_.filter(data,function(n){return n.exists==1;}),function(n){return n.id;});
		}

	}]);
});