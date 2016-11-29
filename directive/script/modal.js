define(["app"],function(app){
	app.directive("lmmodal",function($location){
		return {
			restrict:"E",
			scope:{},
			transclude:true,
			templateUrl:"../directive/html/modal.html",
			controller:function($scope){
				$scope.isShow = $scope.isShowMask = false;
				
				$scope.toggle = function(flag){
					if(flag === undefined){
						flag = !scope.isShow;
					}
					$scope.isShow = $scope.isShowMask = flag;
				};

				$scope.$on('toggleModal',function(e,args){
					var name = args.name;
					var flag = args.flag !== undefined ? args.flag : true;
					if(name == $scope.name || name == '$self'){
						$scope.toggle(flag);
						if(args.updateInfo){
							$scope.$broadcast('updatePopupContent',args.updateInfo);
						}
					}
				});

				$scope.$on('reportTitle', function(e, args) {
					$scope.title = args.title;
				});
				$scope.$on('hideMask',function(){
					$scope.toggle(false);
				});
			},
			link:function($scope,$element,$attr){
				$scope.name = $attr["lmAttrName"];
				$scope.title = $scope.title || $attr["lmAttrTitle"];
			}
		};
	});
});