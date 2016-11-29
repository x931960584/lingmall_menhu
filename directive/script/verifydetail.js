define(["app",
		"service-goods",
		"service-img"
	],function(app){
	app.directive("lmverifydetail",["lmGoodsService","lmImgService",'$routeParams',function(goodsService,imgService,$routeParams){
		return {
			restrict:"E",
			scope:{},
			templateUrl:"../directive/html/verifydetail.html",
			link:function($scope,$element,$attrs){

				$scope.serviceNumber = $routeParams.serviceNumber;
				$scope.barcode = $routeParams.barcode;
				$scope.type = $routeParams.type;

				$scope.getDetail = function(cb){
					goodsService.verifydetail($scope.serviceNumber,$scope.barcode,$scope.type)
					.success(function(data){
						$scope.data = data;
						$scope.sku_id = data.sku_id;
						//console.log("detail",data);
						cb && cb();
					})
					.error(function(data){
						console.log("error detail",data);
						alert('没有找到相应数据!');
					});
				};
			
				$scope.getPics = function(){
					var code = $scope.data.sku_id;
					var xType = 2;
					imgService.getPics(code,xType,function(err,data){
						$scope.imgData = data;
						//console.log("img",data);

						var _getFullurl = function(d){
								return imgService.getFullurl(d.domain+"/"+d.key,100);
							};

						$scope.pics_main = _.map(data["1"],_getFullurl);
						$scope.pics_detail = _.map(data["2"],_getFullurl);
						$scope.pics_tag = _.map(data["3"],_getFullurl);
						$scope.pics_box = _.map(data["4"],_getFullurl);
						
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

				//通过
				$scope.rejectType = '';
				$scope.through = function(serviceNumber){
					if($scope.data.status==4||$scope.data.status==3){return;};
					var status = 3;
					var rejectContent = null;
					var list = [{
						barcode:$scope.barcode,
						status:status,
						type:$scope.type,
						sku_id:$scope.sku_id,
						rejectType:$scope.rejectType,
						rejectContent:rejectContent
					}];
					goodsService.submit($scope.serviceNumber,list)
					.success(function(data){
						$scope.data.status = status;
					});
				};

				//驳回
				$scope.rejected = function(){
					if($scope.data.status==4||$scope.data.status==3){return;};
					$scope.rejectedBox = true;
				};

				//确定驳回
				$scope.confirmRejected = function(serviceNumber){

					/*{
					    "access_token": "用户访问凭证",
					    "barcode":"条形码过滤",
					    "status":"状态 2=>不通过"
					    "rejectType": "驳回原因 1=>模糊",
					    "rejectContent": "驳回详情",
					}*/
					var status = 4;
					var list = [{
						barcode:$scope.barcode,
						status:status,
						type:$scope.type,
						sku_id:$scope.sku_id,
						rejectType:$scope.rejectType,
						rejectContent:$scope.rejectContent
					}];

					goodsService.submit($scope.serviceNumber,list)
					.success(function(data){
						$scope.rejectedBox = false;
						$scope.data.status = status;
					})
				};

				$scope.search = function(){
					$scope.serviceNumber = $routeParams.serviceNumber;
					$scope.barcode = $routeParams.barcode;
					$scope.type = $routeParams.type;
					//console.log("serviceNumber",$scope.serviceNumber,$scope.barcode);
					
					$scope.getDetail(function(){
						$scope.getThumb();				
						$scope.getPics();
					});
				};

				//隐藏驳回悬浮框
				$scope.closeRejected = function(){
					$scope.rejectedBox = false;
				};

				// $scope.listen = function(){
				// 	$scope.$on('verifydetail.detail',function(e,args){
				// 		$scope.serviceNumber = args.serviceNumber;
				// 		$scope.barcode = args.barcode;
				// 		$scope.type = args.type;
				// 		console.log("serviceNumber",$scope.serviceNumber,$scope.barcode);
						
				// 		$scope.getDetail(function(){
				// 			$scope.getThumb();				
				// 			$scope.getPics();
				// 		});
				// 	});

				// };

				// $scope.listen();

				$scope.getDetail(function(){
						$scope.getThumb();				
						$scope.getPics();
				});
			}
		}
	}]);
});