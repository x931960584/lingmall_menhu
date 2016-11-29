define(["app",
	"underscore",
	"cookie",
	"service-img",
	"directive-modal"
	],function(app,_,cookie){
	app.directive("lmproductdetail",function(){
		return {
			restrict:"E",
			templateUrl:"../directive/html/productdetail.html",
			controller:[
			"$rootScope",
			"$routeParams",
			"$scope",
				"$location",
			"lmImgService",
			"lmUserService",
			"lmGoodsService",
			function($rootScope,$routeParams,$scope,$location,imgService,userService,goodsService) {
				$scope.exists = -1;
				$scope.isShowMask = false;
				$scope.getProductdetail = function () {
					// goodsService.get($scope.goodId,$scope.db)
					// .success(function(data,status,headers,config){
					// 	// console.log(data,status,headers,config);
					// 	//$scope.info = data;
					// 	//$scope.setVpath();

					// 	//$scope.getThumb();
					// 	//$scope.getPics();
					// });
					/*goodsService.goodinfo($scope.goodId,$scope.db)
					 .success(function(data,status,headers,config){
					 $scope.info = data;
					 $scope.exists = data.exists;

					 var nutrientList = data.nutrient_content;
					 var manufacturerList = data.manufacturer;

					 $scope.nutrient_content = [];
					 $scope.manufacturer = [];

					 function getNutrient(nutrientList){
					 for(var i= 0;i<nutrientList.length;i++){
					 if(nutrientList[i].length){
					 getNutrient(nutrientList[i]);
					 }else{
					 $scope.nutrient_content.push(nutrientList[i]);
					 }
					 }
					 };
					 getNutrient(nutrientList);

					 function getManufacturer(manufacturerList){
					 for(var i = 0;i<manufacturerList.length; i++){
					 if(manufacturerList[i].length){
					 getManufacturer(manufacturerList[i]);
					 }else{
					 $scope.manufacturer.push(manufacturerList[i]);
					 }
					 }
					 };
					 getManufacturer(manufacturerList);

					 $scope.setVpath();

					 $scope.getThumb();
					 $scope.getPics();
					 });*/
					goodsService.goodsinfo($scope.goodsId)
						.success(function (data) {
							$scope.info = data;
							console.log("data", data);
							$scope.db = $scope.info.db;

							$scope.getThumb();
							$scope.getPics();
						});
				};

				// $scope.setVpath = function(){
				// 	var category = $scope.info.base.category;
				// 	$scope.vpath = (
				// 		category.length === 0 ?
				// 		[] :
				// 		[
				// 			category.one.value,
				// 			category.two.value,
				// 			category.tree.value
				// 		]
				// 	).concat($scope.info.base.name);

				// };
				/*$scope.setVpath = function(){
				 var category = $scope.info.category;
				 $scope.vpath = (
				 category.length === 0 ?
				 [] :
				 [
				 category.one.value,
				 category.two.value,
				 category.tree.value
				 ]
				 ).concat($scope.info.name);

				 };*/


				$scope.getPics = function () {
					var code = $scope.info.sku_id;
					var xtype = 2;//图片类型，如jpg原图、白底png、透明png，分别为1、2、3
					imgService.getPics(code, xtype, function (err, data) {
						$scope.priceDict = {};

						// mock
						_.each(data, function (n) {
							_.each(n, function (nn) {
								$scope.priceDict[nn.key] = nn.price;
							})
						});

						var _getFullurl = function (d) {
							return imgService.getFullurl(d.domain + "/" + d.key, 100);
						};

						var _picMap = function (n) {
							return {
								url: _getFullurl(n),
								key: n.key,
								imageInfo: n.imageInfo
							};
						};

						$scope.pics_main = _.map(data["1"], _getFullurl);
						$scope.pics_detail = _.map(data["2"], _getFullurl);
						$scope.pics_tag = _.map(data["3"], _getFullurl);
						$scope.pics_box = _.map(data["4"], _getFullurl);
						$scope.pics_market = _.map(data["6"], _picMap);//营销图“6”

						// market pics
						$scope.marketDict = {};
						_.each($scope.pics_market, function (n) {
							$scope.marketDict[n.key] = 1;
						});

						$scope.pics_main_showindex = 0;
						$scope.pics_detail_showindex = 0;
						$scope.pics_tag_showindex = 0;
						$scope.pics_box_showindex = 0;


						$scope.$apply();
					});
				};

				$scope.getThumb = function () {
					var code = $scope.info.sku_id;
					imgService.getThumb([code], function (err, data) {
						if (data[0]) {
							var imgdata = imgService.getFullurl(data[0].domain + "/" + data[0].key, 500);
							$scope.setBigimg(imgdata);
							$scope.$apply();
						}
					});
				};

				//营销图显示原图
				$scope.setOriginalImage = function (d) {
					$scope.isShowMask = true;
					d = d.replace("-thumbnail100", "")
					$scope.imgUrl = d;
				};
				$scope.close = function () {
					$scope.isShowMask = false;
				};

				/*$scope.addMyGood=function(){
				 goodsService.addGoods([{id:$scope.goodId,db:$scope.db}])
				 .success(function(data){
				 $scope.exists = 2;
				 $scope.$broadcast('toggleModal',{name:'buy',flag:true,updateInfo:{buyFlag:true}});
				 })
				 .error(function(err,code){
				 if(code == 401 || code == 412){
				 $scope.$broadcast('toggleModal',{name:'login',flag:true});
				 }
				 // console.log(arguments);
				 });
				 };*/

				$scope.addMyGood = function () {
					goodsService.shopcartAdd([{goodsId: $scope.goodId, db: $scope.db}])
						.success(function (data) {
							$scope.exists = 2;
						});
				};

				$scope.showLen = 6;
				$scope.setShowIndex = function (name, add) {
					var d = $scope["pics_" + name];
					var si = $scope["pics_" + name + "_showindex"];
					si += (add - 0);
					si = Math.min(d.length - $scope.showLen, Math.max(0, si));
					console.log(si);
					$scope["pics_" + name + "_showindex"] = si;
				};

				$scope.setBigimg = function (data) {
					$scope.currBigimg = data.replace(/\d+$/, '');
					data = data.replace(/\d+$/, "500");
					$scope.bigimg = data;
					data = data.replace(/\d+$/, "1000");
					$scope.titanimg = data;
					titanimgNode.css({
						"background-image": "url('" + data + "')"
					});
				};

				var bigimgNode = $(".content-img");
				console.log("5555", bigimgNode.offset());
				var titanimgNode = $(".titanImg");
				var glassNode = $(".glass");

				$scope.showTitanimg = function (e) {
					// console.log([e.offsetX,e.offsetY].join("##"));
					var offset = bigimgNode.offset();
					titanimgNode.css({left: offset.left + 600, top: offset.top});
					$scope.isShowTitanimg = true;
				};

				$scope.hoverTitanimg = function (e) {
					// console.log([e.offsetX,e.offsetY].join("***"));
					var width = bigimgNode.width(),
						height = bigimgNode.height();
					var percX = e.offsetX / width * 100 + "%",
						percY = e.offsetY / height * 100 + "%";
					titanimgNode.css({
						"background-position": percX + " " + percY
					});
					var glassWidth = glassNode.width(),
						glassHeight = glassNode.height();
					var glassLeft = e.offsetX - glassWidth / 2,
						glassTop = e.offsetY - glassHeight / 2;
					glassLeft = Math.min(Math.max(0, glassLeft), width - glassWidth);
					glassTop = Math.min(Math.max(0, glassTop), width - glassHeight);

					glassNode.css({
						left: glassLeft,
						top: glassTop
					});
				};
				$rootScope.$watch('isLogin', function (nv, ov) {
					if (nv && !ov) {
						//console.log('>>>>>>>>>>>>>check');
						//$scope.isGoodExist();
					}
				});

				$scope.goLogin = function(){
					$location.path("/loginpage");
				}
			}
			] ,
			link:function($scope,$element,$attrs){
				/*var unionId = $attrs.goodId;
				var arr = unionId.split(",");
				$scope.goodId = arr[0];
				$scope.db = arr[1] || 1; // 1是老数据库
				$scope.getProductdetail();*/
				
				//$scope.isGoodExist();

				$scope.goodsId = $attrs.goodId;
				$scope.getProductdetail();
			}
		};

		
	});
});