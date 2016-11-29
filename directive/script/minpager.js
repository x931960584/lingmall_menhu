define(["app"],function(app){
	app.directive("lmminpager",function(){
		return {
			restrict:"E",
			templateUrl:"../directive/html/minpager.html",
			link:function($scope,$element,$attrs){

				$scope.pageIndex = 0;

				// 向前翻页
				$scope.pagePrev = function(){
					if($scope.pageIndex == 0){
						return;
					}
					$scope.pageIndex --;
					$scope.$emit('pageIndexChanged',$scope.pageIndex);
				};

				// 向后翻页
				$scope.pageNext = function(){
					if($scope.pageIndex == $scope.pageCount-1){
						return;
					}
					$scope.pageIndex ++;
					$scope.$emit('pageIndexChanged',$scope.pageIndex);
				};
			}
		}
	});
});