requirejs.config({
	//默认情况下模块所在目录为js/lib
	baseUrl: '/',
	//当模块id前缀为app时，他便由js/app加载模块文件
	//这里设置的路径是相对与baseUrl的，不要包含.js
	paths: {
		angular: 'bower_components/angular/angular',
		angularRoute:"bower_components/angular-route/angular-route.min",
		angularMd5:"bower_components/angular-md5/angular-md5.min",

		// 用以blob技术打包
		fileSaver:"bower_components/filesaver/FileSaver.min",
		jszip:"bower_components/jszip/dist/jszip",

		underscore:"bower_components/underscore/underscore",
		async:"bower_components/async/dist/async.min",
		dateJs:'bower_components/DateJS/build/production/date-zh-CN.min',
		//
		route:"script/route",
		app:"script/app",
		config:"script/config",

		// service
		"service-goods":"service/script/goods",
		"service-user":"service/script/user",
		"service-img":"service/script/img",
		"service-util":"service/script/util",
		// ctrl
		"ctrl-index":"controller/script/index",
		"ctrl-homepage":"controller/script/homepage",
		"ctrl-nodatapage":"controller/script/nodatapage",
		"ctrl-vippage":"controller/script/vippage",
		"ctrl-adpage":"controller/script/adpage",
		"ctrl-activepage":"controller/script/activepage",
		"ctrl-mygoodspage":"controller/script/mygoodspage",
		"ctrl-loginpage":"controller/script/loginpage",
		"ctrl-registerpage":"controller/script/registerpage",
		"ctrl-auditmanagementpage":"controller/script/auditmanagementpage",
		"ctrl-datacenterpage":"controller/script/datacenterpage",
		"ctrl-categorydatapage":"controller/script/categorydatapage",
		"ctrl-productdetailpage":"controller/script/productdetailpage",
		"ctrl-goodsdatapage":"controller/script/goodsdatapage",
		"ctrl-goodslistpage":"controller/script/goodslistpage",
		"ctrl-shopcartpage":"controller/script/shopcartpage",
		"ctrl-cashierdeskpage":"controller/script/cashierdeskpage",
		"ctrl-applyservicepage":"controller/script/applyservicepage",
		"ctrl-customservicepage":"controller/script/customservicepage",
		"ctrl-myorderspage":"controller/script/myorderspage",
		"ctrl-aboutpage":"controller/script/aboutpage",
		"ctrl-detailpage":"controller/script/detailpage",
		'ctrl-verifydetailpage':'controller/script/verifydetailpage',
		'ctrl-serviceentrancepage':'controller/script/serviceentrancepage',
		'ctrl-integrationpage':'controller/script/integrationpage',
		// directive
		"directive-test":"directive/script/test",
		"directive-home":"directive/script/home",
		"directive-mygoods":"directive/script/mygoods",
		"directive-topbar":"directive/script/topbar",
		"directive-copyright":"directive/script/copyright",
		"directive-topmenu":"directive/script/topmenu",
		"directive-sidebar":"directive/script/sidebar",
		"directive-pager":"directive/script/pager",
		"directive-leftsidebar":"directive/script/leftsidebar",
		"directive-auditmanagement":"directive/script/auditmanagement",
		"directive-detail":"directive/script/detail",
		"directive-headbar":"directive/script/headbar",
		"directive-datacenter":"directive/script/datacenter",
		"directive-categorydata":"directive/script/categorydata",
		"directive-goodslist":"directive/script/goodslist",
		"directive-productdetail":"directive/script/productdetail",
		"directive-allorders":"directive/script/allorders",
		"directive-shopcartbtn":"directive/script/shopcartbtn",
		"directive-shopcart":"directive/script/shopcart",
		"directive-cashierdesk":"directive/script/cashierdesk",
		"directive-applyservice":"directive/script/applyservice",
		"directive-customservice":"directive/script/customservice",
		"directive-myorders":"directive/script/myorders",
		"directive-batchsearch":"directive/script/batchsearch",
		"directive-minpager":"directive/script/minpager",
		"directive-goodsdata":"directive/script/goodsdata",
		"directive-verify":"directive/script/verify",
		"directive-verifydetail":"directive/script/verifydetail",
		"directive-modal":"directive/script/modal",
		"directive-login":"directive/script/login",
		"directive-register":"directive/script/register",
		"directive-select":"directive/script/select",
		"directive-settlement":"directive/script/settlement",
		"directive-about":"directive/script/about",
		"directive-catebar":"directive/script/catebar",
		"directive-serviceentrance":"directive/script/serviceentrance",
		"directive-integration":"directive/script/integration",

		// tool directive
		"tool-checker":"directive/script/checker",
		"tool-batchsearchbtn":"directive/script/batchsearchbtn",
		"tool-confirmlogin":"directive/script/confirmlogin",

		// constant
		"con-const":"service/script/const",

		// filter
		"filter-goodsType":"filter/script/goodsType",

		// addons
		"cookie":"bower_components/cookie/cookie.min",
		'datePicker':'bower_components/DatePicker/js/datepicker',

		// end tail
		"jquery":"bower_components/jquery/jquery.min"
	},
	shim:{
		'angularRoute':["angular"],
		"angularMd5":["angular"],
		'datePicker':['jquery']
	}

});

// 开始逻辑.
requirejs(['jquery','route','app'],function($,route,app){
	route.init();
	$(function(){
		angular.bootstrap(document.body,[app.name]);
	});
});
