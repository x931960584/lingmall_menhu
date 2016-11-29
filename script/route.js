define(["app",
		"angularRoute",
		'ctrl-index',
		"ctrl-homepage",
		"ctrl-nodatapage",
		"ctrl-vippage",
		"ctrl-adpage",
		"ctrl-activepage",
		"ctrl-mygoodspage",
		"ctrl-auditmanagementpage",
		"ctrl-categorydatapage",
		"ctrl-productdetailpage",
		"ctrl-datacenterpage",
		"ctrl-applyservicepage",
		"ctrl-goodsdatapage",
		"ctrl-goodslistpage",
		"ctrl-shopcartpage",
		"ctrl-cashierdeskpage",
		"ctrl-applyservicepage",
		"ctrl-customservicepage",
		"ctrl-myorderspage",
		"ctrl-detailpage",
		"ctrl-aboutpage",
		"ctrl-loginpage",
		"ctrl-registerpage",
		"ctrl-verifydetailpage",
		"ctrl-serviceentrancepage",
		"ctrl-integrationpage"
	],
	function(app){
		var initRoute = function(){
			app.config(["$routeProvider",function($routeProvider){
				$routeProvider
					.when("/",{
						templateUrl:"view/homepage.html",
						controller:"lmHomepageCtrl"
					})
					.when("/homepage",{
						templateUrl:"view/homepage.html",
						controller:"lmHomepageCtrl"
					})
					.when("/nodatapage",{
						templateUrl:"view/nodatapage.html",
						controller:"lmNoDatapageCtrl"
					})
					.when("/vippage",{
						templateUrl:"view/vippage.html",
						controller:"lmVippageCtrl"
					})
					.when("/adpage",{
						templateUrl:"view/adpage.html",
						controller:"lmAdpageCtrl"
					})
					.when("/activepage",{
						templateUrl:"view/activepage.html",
						controller:"lmActivepageCtrl"
					})
					.when("/mygoodspage",{
						templateUrl:"view/mygoodspage.html",
						controller:"lmMygoodspageCtrl"
					})
					.when("/auditmanagementpage",{
						templateUrl:"view/auditmanagementpage.html",
						controller:"lmAuditmanagementpageCtrl"
					})
					.when("/datacenterpage",{
						templateUrl:"view/datacenterpage.html",
						controller:"lmDatacenterpageCtrl"
					})
					.when("/categorydatapage/:categoryId",{
						templateUrl:"view/categorydatapage.html",
						controller:"lmCategorydatapageCtrl"
					})
					.when("/productdetailpage/:goodId",{
						templateUrl:"view/productdetailpage.html",
						controller:"lmProductdetailpageCtrl"
					})
					.when("/goodsdatapage",{
						templateUrl:"view/goodsdatapage.html",
						controller:"lmGoodsdatapageCtrl"
					})
					.when("/goodslistpage/:params?",{
						templateUrl:"view/goodslistpage.html",
						controller:"lmGoodslistpageCtrl"
					})
					.when("/shopcartpage",{
						templateUrl:"view/shopcartpage.html",
						controller:"lmShopcartpageCtrl"
					})
					.when("/cashierdeskpage/:orderNo",{
						templateUrl:"view/cashierdeskpage.html",
						controller:"lmCashierdeskpageCtrl"
					})
					.when("/applyservicepage/:barcodeList?",{
						templateUrl:"view/applyservicepage.html",
						controller:"lmApplyservicepageCtrl"
					})
					.when("/customservicepage",{
						templateUrl:"view/customservicepage.html",
						controller:"lmCustomservicepageCtrl"
					})
					.when("/myorderspage",{
						templateUrl:"view/myorderspage.html",
						controller:"lmMyorderspageCtrl"
					})
					// detailType枚举:detail,goodsinfo
					.when("/detailpage/:goodsId/:detailType?",{
						templateUrl:"view/detailpage.html",
						controller:"lmDetailCtrl"
					})
					.when("/aboutpage/:routeName",{
						templateUrl:"view/aboutpage.html",
						controller:"lmAboutpageCtrl"
					})
					.when("/loginpage",{
						templateUrl:"view/loginpage.html",
						controller:"lmLoginpageCtrl"
					})
					.when("/verifydetailpage/:serviceNumber/:barcode/:type",{
						templateUrl:'view/verifydetailpage.html',
						controller:'lmVerifydetailpageCtrl'
					})
					.when("/serviceentrancepage",{
						templateUrl:"view/serviceentrancepage.html",
						controller:"lmServiceentrancepageCtrl"
					})
					.when("/integrationpage",{
						templateUrl:"view/integrationpage.html",
						controller:"lmIntegrationpageCtrl"
					})
					// .when("/worktable",{
					// 	templateUrl:"view/worktable",
					// 	controller:"lmWorktableCtrl"
					// })
					// .when("/loginpage",{
					// 	templateUrl:"view/loginpage.html",
					// 	kkk:'kkk',
					// 	controller:"lmLoginpageCtrl"
					// })
					// .when("/productdetail/:goodId",{
					// 	templateUrl:"view/productdetail.html",
					// 	controller:"lmProductdetailCtrl"
					// })
					// .when("/apisupportpage",{
					// 	templateUrl:"view/apisupportpage.html",
					// 	controller:"lmApisupportpageCtrl"
					// })
					// .when("/shujubaopage",{
					// 	templateUrl:"view/shujubaopage.html",
					// 	controller:"lmShujubaopageCtrl"
					// })
					// .when("/goodspage/:subpage",{
					// 	templateUrl:"view/goodspage.html",
					// 	controller:"lmGoodspageCtrl"
					// })
					// .when("/goodslist/:params?",{
					// 	templateUrl:"view/goodslistpage.html",
					// 	controller:"lmGoodslistpageCtrl"
					// })
					// .when("/codesearchpage",{
					// 	templateUrl:"view/codesearchpage.html",
					// 	controller:"lmCodesearchpageCtrl"
					// })
					// .when("/customservicepage",{
					// 	templateUrl:"view/customservicepage.html",
					// 	controller:"lmCustomservicepageCtrl"
					// })
					.when("/registerpage",{
						templateUrl:"view/registerpage.html",
						controller:"lmRegisterpageCtrl"
					})
					// .when("/forgetpw",{
					// 	templateUrl:"view/forgetpw.html",
					// 	controller:"lmForgetpwCtrl"
					// })
					// .when("/goodsdata/:params?",{
					// 	templateUrl:"view/goodsdatapage.html",
					// 	controller:"lmGoodsdatapageCtrl"
					// })
					// .when("/categorydata/:categoryId",{
					// 	templateUrl:"view/categorydatapage.html",
					// 	controller:"lmCategorydatapageCtrl"
					// })
					// .when("/goodspage/mycollectpage",{
					// 	templateUrl:"view/mycollectpage.html",
					// 	controller:"lmMycollectpageCtrl"
					// })
					// .when("/downpicpage/:goodId",{
					// 	templateUrl:"view/downpicpage.html",
					// 	controller:"lmDownpicpageCtrl"
					// })
					// .when("/about",{
					// 	templateUrl:"view/about.html",
					// 	controller:"lmAboutCtrl"
					// })
					// .when("/settlement/:params",{
					// 	templateUrl:"view/settlement.html",
					// 	controller:"lmSettlment"
					// })
					.otherwise({
						// redirectTo:"/"
					});
			}]);

			// app.run(['$rootScope','$location','lmuserservice',function($rootScope,$location,userService){
			// $rootScope.$on('$locationChangeStart',function(event,nextUrl){
			// 	//console.warn(nextUrl);
			// 	var authPathArr = ['/goodspage/mycollectpage','/goodspage/info','goodspage/expensecenter'];
			// 	if(_.find(authPathArr,function(n){return nextUrl.indexOf(n)>=0;})){
			// 		if(!$rootScope.isLogin){
			// 			userService.isLogin(function(err,data){
			// 				if(!data){
			// 					$rootScope.prevPath = nextUrl.split("#")[1];
			// 					console.log('go to loginpage');
			// 					$location.path('/loginpage');
			// 				}else{
			// 					$rootScope.isLogin = true;
			// 					$rootScope.username = userService.readLocalUsername();
			// 				}
			// 				$rootScope.$apply();
			// 			});
			// 		}
			// 	}
			// });
			// }]);
		};
		return {init:initRoute};
	}
);
