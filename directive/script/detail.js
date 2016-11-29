define(["app",
		"service-goods",
		"service-img",
		"service-util",
		'tool-confirmlogin',
		"directive-modal",
		"tool-checker"
	],function(app){
	app.directive("lmdetail",["$routeParams","lmGoodsService","lmImgService","lmUtilService",function($routeParams,goodsService,imgService,utilService){
		return {
			restrict:"E",
			templateUrl:"../directive/html/detail.html",
			link:function($scope,$element,$attrs){

				$scope.afterAdd = false;
				$scope.isShowMask = false;
				$scope.isAddSuccessed = false;

				$scope.detailType = $routeParams['detailType'] || 'detail';
				$scope.getDetail = function(cb){
					var goodsId = $routeParams.goodsId;
					if($scope.detailType=='verifydetail'){
						goodsId.replace(serviceNumber,barcode);
					}
					goodsService[$scope.detailType](goodsId)
					.success(function(data){
						$scope.data = data;
						$scope.exists = data.exists;
						//"exists": "0=>不存在(发布需求); 1=>不存在商品库(加入商品库); 
						//2=>存在(已经加入商品库); 3=>已购买; 4=>未加入购物车 ; 5=>已加入购物车"
						//console.log("exists",$scope.exists);
						//console.log("detail",data);
						cb && cb();
					});
				};
			

				$scope.getPics = function(){
					var code = $scope.data.sku_id;
					var xType = 2;
					imgService.getPics(code,xType,function(err,data){
						$scope.imgData = data;

						$scope.priceDict = {};
						
						// mock
						_.each(data,function(n){
							_.each(n,function(nn){
								// delete start
							//	nn.price =~~(Math.random()*100)+10;
								// delete end
								$scope.priceDict[nn.key] = nn.price;
							})
						});

						//console.log("img",data);

						var _getFullurl = function(d){
								return imgService.getFullurl(d.domain+"/"+d.key,100);
							};

						var _picMap = function(n){
							return {
								url:_getFullurl(n),
								key:n.key,
								imageInfo:n.imageInfo,
								price:n.price
							};
						};

						$scope.pics_main = _.map(data["1"],_picMap);
						$scope.pics_detail = _.map(data["2"],_picMap);
						$scope.pics_tag = _.map(data["3"],_picMap);
						$scope.pics_box = _.map(data["4"],_picMap);
						$scope.pics_market = _.map(data["6"],_picMap);//营销图“6”
						
						// stand pics
						$scope.standDict = {};
						_.each($scope.pics_main.concat($scope.pics_detail,$scope.pics_tag,$scope.pics_box),function(n){
							$scope.standDict[n.key] = 1;
						});

						// market pics
						$scope.marketDict = {};
						_.each($scope.pics_market,function(n){
							$scope.marketDict[n.key] =1;
						});

						$scope.pics_main_showindex = 0;
						$scope.pics_detail_showindex = 0;
						$scope.pics_tag_showindex = 0;

						$scope.$apply();
					});
				};

				//
				$scope.getThumb = function(){
					var skuId = $scope.data.sku_id;
					imgService.getThumb([skuId],function(err,data){
						if(data[0]){
							var bigimgData = imgService.getFullurl(data[0].domain+"/"+data[0].key,500);
							$scope.setBigimg(bigimgData);
							//console.log("bigimg",$scope.bigimg);
							$scope.$apply();
						}
					})
				};

				//点击小图变成大图
				$scope.setBigimg = function(data){
					$scope.currBigimg = data.replace(/\d+$/,'');
					data = data.replace(/\d+$/,"500");
					$scope.bigimg = data;
					//把图片换成1000
					data = data.replace(/\d+$/,'1000');
					originImgNode.css({
						"background-image": "url('" + data + "')"
					});
				};

				//放大镜
				var bigimgNode = $(".bigImg");
				var maskLayerNode = $(".mask-layer");
				var originImgNode = $(".origin-img");
				$scope.showOriginImg = function(e){
					var offset = bigimgNode.offset();
					originImgNode.css({left:offset.left+600,top:offset.top});
					$scope.isShoworiginimg = true;
				};

				$scope.hoverOriginImg = function(e){
					var width = bigimgNode.width(),
							height = bigimgNode.height();
						var percX = e.offsetX/width*100+"%",
							percY = e.offsetY/height*100+"%";
						originImgNode.css({
							"background-position":percX+" "+percY
						});
						var maskLayerWidth = maskLayerNode.width(),
							maskLayerHeight = maskLayerNode.height();
						var maskLayerLeft = e.offsetX-maskLayerWidth/2,
							maskLayerTop = e.offsetY-maskLayerHeight/2;
							maskLayerLeft = Math.min(Math.max(0,maskLayerLeft), width-maskLayerWidth);
							maskLayerTop = Math.min(Math.max(0,maskLayerTop), width-maskLayerHeight);

						maskLayerNode.css({
							left:maskLayerLeft,
							top:maskLayerTop
						});
				};

				//左右点击轮播框
				$scope.showLen = 4;
				$scope.setShowIndex = function(name,add){
					var d = $scope["pics_"+name];
					var si = $scope["pics_"+name+"_showindex"];
					si += (add-0);
					si = Math.min(d.length-$scope.showLen,Math.max(0,si));
					//console.log(si);
					$scope["pics_"+name+"_showindex"] = si;
				};

				//营销图显示原图
				$scope.setOriginalImage = function(d){
					$scope.isShowMask = true;
					d = d.replace("-thumbnail100","");
					$scope.imgUrl = d;
				};
				$scope.close = function(){
					$scope.isShowMask = false;
				};

				//下载
				$scope.down = function(){
					var skuId = $scope.data.sku_id;
					var code = $scope.data.barcode;
					var list = {skuId:skuId,code:code};
					imgService.getZipPro(list);
				};


				//加入购物车
				/*
					"param": [
				        {
				            "goodsId": "goodsId",
				            "sku_id":"sku_id",
				            "name":"商品名",
				            "pictureNum":"数字 用于显示标准图:x张",
       						"detailPageNum":"数字 营销图:y张",
				            "price": "价格",
				            "db":"",
				            "pics":["648436100552/a2/648436100552002.jpg", "22222222222222"]
				        }
				    ]
				*/
				$scope.addGoods = function(){
					var goodlist = {
						goodsId:$scope.data.goodsId, 
						sku_id:$scope.data.sku_id,
						name:$scope.data.name,
						pictureNum:$scope.standCount,
						detailPageNum:$scope.marketCount,
						price:$scope.totalPrice,
						db:$scope.data.db,
						pics:_.map($scope.checkids,function(v,k){return k;})
					};
					var goodlist = [goodlist];
					$scope.choosePicNum = $scope.standCount + $scope.marketCount;
					if($scope.totalPrice==''||$scope.choosePicNum==0){
						alert("请选择购买商品！");
						return;
					}
					goodsService.shopcartAdd(goodlist)
					.success(function(data,status){
						//console.log(data,status,"加入购物车");
						if(status==204){
							$scope.$emit('shopcart.afterAdd');
							$scope.exists = 5;
							$scope.isAddSuccessed = true;
						}

					});
				};

				// 查询购物车
				$scope.shopcart = function(){
					goodsService.shopcart(0,1)
					.success(function(data){
						$scope.shopcartTotalcount = data.count;
						//$scope.getDetail();
					});
				};

				//
				$scope.linkTo = function(path){
					utilService.linkTo(path,false);
					$scope.isAddSuccessed = true;
				};

				// 购物车
				$scope.$on('shopcart.afterAdd',function(e,args){
					// 刷新下购物车的信息
					$scope.shopcart();
				});

				//关闭购物车弹框
				$scope.closeBox = function(){
					$scope.isAddSuccessed = false;
				};

				$scope.$watch('checkids',function(ov,nv){
					//console.log($scope.checkids);
					var sum = 0;
					var standCount =0;
					var marketCount =0;
					_.each($scope.checkids,function(v,k){
						if(v){
							// price
							sum += ($scope.priceDict[k]-0);
							sum = sum.toFixed(2)-0;

							// cal count
							standCount += $scope.standDict[k] || 0;
							marketCount += $scope.marketDict[k] || 0;
						}
					});
					$scope.totalPrice = sum;
					$scope.standCount = standCount;
					$scope.marketCount = marketCount;


					//console.log($scope.imgData);
				},true);

				$scope.getDetail(function(){
					$scope.getThumb();				
					$scope.getPics();
				});
			}
		};
	}]);
});