define([
		'app',
		'config',
		'service-user'
	],function(app,config){
		app.service('lmGoodsService', ['$http','lmUserService',function($http,userService){
			var urlPrefix = config.goodsServiceUrl;
			var urlDict = {
				// 
				goodsinfo:'/lingmall/goods/info/{goodsId}',
				//
				metadata:'/lingmall/metadata/{type}',
				category:'/lingmall/category',
				goodslist:'/lingmall/goods/list',
				subCategory:'/lingmall/category/{id}',
				search:'/lingmall/goods/search',
				batchsearch:'/lingmall/goods/batchsearch',
				// my
				goods:'/lingmall/my/goods',
				// detail:'/lingmall/my/goods/{id}',
				detail:'/lingmall/my/goods/sku/{id}',

				serviceApply:'/lingmall/service/application',
				service:'/lingmall/my/service',
				serviceDetail:'/lingmall/my/service/{serviceNumber}',
				progress:'/lingmall/my/service/progress/{serviceNumber}',
				contact:'/lingmall/my/service/contacts/{projectId}',
				verifydetail:'/lingmall/my/service/info/{serviceNumber}/{barcode}',
				submit:'/lingmall/my/service/{serviceNumber}',
				mybatchsearch: '/lingmall/my/goodsearch',

				// shopcart
				shopcart:'/lingmall/my/shopcart',
				orderInShopcart:'/lingmall/my/shopcart/order/{orderNo}',

				//myorders
				createorders:"/lingmall/order",
				myorders:"/lingmall/my/order",
				paystatus:"/lingmall/order/paystatus"
			};
			_.each(urlDict,function(v,k){
				urlDict[k] = urlPrefix + v;
			});

			var methodDict = {
				post:'POST',
				get:'GET',
				put:'PUT',
				delete:'DELETE'
			};

			// 元数据类型编号
			this.metadataTypeDict = {
				// 服务类型
				serviceType:4,
				// 服务状态
				serviceStatus:6,
				goodsType:7,
				// sub服务状态
				serviceDetailStatus:8
			};

			// 特殊状态
			// 审核通过状态
			this.SERVICE_DETAIL_PASS_STATUS = 3;

			// 获取枚举的元数据
			this.metadata = function(type){
				return $http({
					url:urlDict.metadata.replace('{type}',type),
					method:methodDict.get
				});
			};

			// 商品详情-来自数据中心
			this.goodsinfo = function(goodsId){
				return $http({
					url:urlDict.goodsinfo.replace('{goodsId}',goodsId),
					method:methodDict.post,
					data:{
						access_token:userService.token()
					}
				});
			};

			//////////////////////////////////////////////////////////////////////////////////////////////////////

			// 我的商品库
			this.goods = function(barcode,name,type,pageIndex,pageSize){
				return $http({
					url:urlDict.goods,
					method:methodDict.post,
					data:{
						access_token:userService.token(),
						barcode:barcode,
						name:name,
						type:type,
						page:pageIndex-0+1,
						count:pageSize
					}
				});
			};

			// 我的商品详情
			this.detail = function(id){
				return $http({
					url:urlDict.detail.replace('{id}',id),
					method:methodDict.post,
					data:{
						access_token:userService.token()
					}
				});
			};
			// 申请service
			this.serviceApply = function(barcodeList,typeList,serviceDemand,contacts){
				return $http({
					url:urlDict.serviceApply,
					method:methodDict.post,
					data:{
						access_token:userService.token(),
						barcode:barcodeList.join(','),
						type:typeList.join(','),
						serviceDemand:serviceDemand,
						contacts:contacts
					}
				});
			};

			// 查询审核
			this.service = function(startTime,endTime,status,pageIndex,pageSize){
				return $http({
					url:urlDict.service,
					method:methodDict.post,
					data:{
						access_token:userService.token(),
						startTime:startTime,
						endTime:endTime,
						status:status,
						page:pageIndex-0+1,
						count:pageSize
					}
				});
			};


			// 查询审核的进度
			this.progress = function(serviceNumber){
				return $http({
					url:urlDict.progress.replace('{serviceNumber}',serviceNumber),
					method:methodDict.post,
					data:{
						access_token:userService.token()
					}
				});
			};

			// 查看联系人
			this.contact = function(projectId){
				return $http({
					url:urlDict.contact.replace('{projectId}',projectId),
					method:methodDict.post,
					data:{
						access_token:userService.token()
					}
				});
			};

			// 查询审核的批次详情
			this.serviceDetail = function(serviceNumber,classId,status,barcode,pageIndex,pageSize){
				return $http({
					url:urlDict.serviceDetail.replace('{serviceNumber}',serviceNumber),
					method:methodDict.post,
					data:{
						access_token:userService.token(),
						classId:classId,
						status:status,
						barcode:barcode,
						page:pageIndex-0+1,
						count:pageSize
					}
				});
			};

			// 查询审核的批次的条码详情

			this.verifydetail = function(serviceNumber,barcode,type){
				return $http({
					url:urlDict.verifydetail.replace('{serviceNumber}',serviceNumber).replace('{barcode}',barcode),
					method:methodDict.post,
					data:{
						access_token:userService.token(),
						type:type
					}
				});
			};

			// 审核
			// list:
			/*
				barcode:barcode,
				status:status,
				rejectType:rejectType,
				rejectContent:rejectContent
			*/
			this.submit = function(serviceNumber,list){
				return $http({
					url:urlDict.submit.replace('{serviceNumber}',serviceNumber),
					method:methodDict.put,
					data:{
						access_token:userService.token(),
						param:list
					}
				});
			};

			// 在'我的商品库'中进行批量搜索
			this.mybatchsearch = function(barcodeList){
				return $http({
					url:urlDict.mybatchsearch,
					method:methodDict.post,
					data:{
						access_token:userService.token(),
						barcode:barcodeList.join(',')
					}
				});
			}

			// 获取分类
			this.category = function(){
				return $http({
					url:urlDict.category,
					method:methodDict.get
				});
			};

			// 获取次级分类
			this.subCategory = function(subId){
				return $http({
					url:urlDict.subCategory.replace('{id}',subId),
					method:methodDict.get
				});
			};


			// 通过分类Id获取商品
			this.goodlist = function(level,catId,pageIndex,pageSize){
				var opts = {
					access_token:userService.token(),
					level:level,
					catId:catId,
					page:pageIndex-0+1,
					count:pageSize
				};
				return $http({
					url:urlDict.goodslist,
					method:methodDict.post,
					data:opts
				});
			};

			

			// --------------------------------------------------------------------------------------
			// 关键字搜索 -------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------------
			this.search = function(keyword,pageIndex,pageSize){
				var opts = {
					access_token:userService.token(),
					keyword:keyword,
					page:pageIndex-0+1,
					count:pageSize
				};
				return $http({
					url:urlDict.search,
					method:methodDict.post,
					data:opts
				});
			};

			// --------------------------------------------------------------------------------------
			// 批量搜索 -------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------------
			this.batchsearch = function(barcodeList){
				var opts = {
					access_token:userService.token(),
					barcode:barcodeList.join(',')
				};
				return $http({
					url:urlDict.batchsearch,
					method:methodDict.post,
					data:opts
				});
			};


			// --------------------------------------------------------------------------------------
			// 购物车 -------------------------------------------------------------------------------
			// --------------------------------------------------------------------------------------

			// 获取购物车中的商品
			this.shopcart = function(pageIndex,pageSize){
				var opts ={
					access_token:userService.token(),
					page:pageIndex-0+1,
					count:pageSize
				};
				return $http({
					url:urlDict.shopcart,
					method:methodDict.post,
					data:opts
				});
			};

			// 商品放入购物车
			// goodlist格式为{goodsId:...,db:...}
			this.shopcartAdd = function(goodlist){
				var opts = {
					access_token:userService.token(),
					param:goodlist
				};
				return	$http({
					url:urlDict.shopcart,
					method:methodDict.put,
					data:opts
				});
			};

			// 商品移出购物车
			// goodlist格式为{goodsId:...,db:...}
			this.shopcartRemove = function(idList){
				var headers = {
					'Content-Type':'application/json'
				};
				var opts = {
					access_token:userService.token(),
					id:idList
				};
				return	$http({
					headers:headers,
					url:urlDict.shopcart,
					method:methodDict.delete,
					data:opts

				});
			};

			// 查询在购物车中的订单详情
			this.orderInShopcart = function(orderNo){
				var opts = {
					access_token:userService.token()
				};

				return $http({
					url:urlDict.orderInShopcart.replace('{orderNo}',orderNo),
					method:methodDict.post,
					data:opts
				});
			};

			//生成订单
			/*{
			    "access_token": "用户访问凭证",
			    "type": "购买类型,默认填1  metaData.type:1",
			    "shopcartId": "1,2  多个,分隔",
			    "count": "数量",
			    "money": "金额"
			}*/
			this.createorders = function(type,shopcartId,count,money){
				var opts = {
					access_token:userService.token(),
					type:1,
					shopcartId:shopcartId,
					count:count,
					money:money
				};
				return $http({
					url:urlDict.createorders,
					method:methodDict.post,
					data:opts
				})
			};

			//查看我的订单
			/*
				"access_token": "用户访问凭证",
			    "orderNo":"订单号",
			    "pay_status":"订单支付状态",
			    "page": "页码, 1开始",
			    "count": "条数"
			*/
			this.myorders = function(orderNo,pay_status,pageIndex,pageSize){
				var opts = {
					access_token:userService.token(),
					orderNo:orderNo,
					pay_status:pay_status,
					page:pageIndex-0+1,
					count:pageSize
				};
				return $http({
					url:urlDict.myorders,
					method:methodDict.post,
					data:opts
				})
			};

			//查看订单支付状态
			/*
				{
				    "access_token": "用户访问凭证",
				    "orderNo":"订单号"
				}
			*/
			this.paystatus = function(orderNo){
				var opts = {
					access_token:userService.token(),
					orderNo:orderNo
				};
				return $http({
					url:urlDict.paystatus,
					method:methodDict.post,
					data:opts
				})
			};

		}]);
	}
);