define(["app"],function(app){
	app.directive("lmtopbar",["lmUtilService","$rootScope","$location",function(utilService,$rootScope,$location){
		return {
			restrict:"E",
			templateUrl:"../directive/html/topbar.html",
			link:function($scope,$element,$attrs){

				$scope.title = $attrs.lmAttrTitle;
				$scope.showIndex = -1;

				$scope.linkTo = function(path,flag){
					utilService.linkTo(path,flag === undefined ? false : $location.path()=='/');
				};

				$scope.navs = [
					{text:"首页",url:"/homepage"},
					{text:"图片超市",url:"/goodsdatapage"},
					{text:"商详定制",url:"/customservicepage"},
					{text:"数据应用",url:"/integrationpage"}
				];

				$scope.showIndex = _.findIndex($scope.navs,function(n){return n.text==$scope.title});
			
				$scope.keydown = function(e,type){
					if(e.keyCode==13){
						$scope.search(type);
					}
				};

				$scope.search = function(type){
					if(type=="keyword"){
						var path = "/goodslistpage/"+JSON.stringify({keyword:$scope.keyword.replace('/','')});
						$location.path(path);
					}else if(type == "keycode"){
						$scope.keycode && $rootScope.$broadcast("searchCode",{cmd:null,codeList:[$scope.keycode]});
					}

				};
				
			}
		};
	}]);
});