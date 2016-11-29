define(["app"],function(app){
	app.directive("lmcatebar",[function(){
		return {
			restrict:"E",
			scope:{},
			templateUrl:"../directive/html/catebar.html",
			link:function($scope,$element,$attrs){
				$scope.title = null;
				$scope.data = null;
				$scope.selectedData = [];
				$scope.isMulti = null;
				$scope.name = null;

				$scope.name = $attrs.name;
				$scope.isMulti = $attrs.isMulti || false;
				
				// 加载分类元数据
				$scope.setMetadata = function(title,data){
					$scope.title = title;
					$scope.data = data;
					$scope.selectedData = [];
				};

				// 选择
				$scope.select = function(value){
					var item = _.find($scope.data,function(n){return n.value == value;});
					if(_.indexOf($scope.selectedData,item)==-1){
						if(!$scope.isMulti){
							$scope.selectedData = [];
						}
						$scope.selectedData.push(item);
						$scope.$emit('catebar.change',{name:$scope.name,data:$scope.selectedData});
					}
				};

				// 反选
				$scope.unSelect = function(value){
					$scope.selectedData = _.filter($scope.selectedData,function(n){
						return n.value!=value;
					});
					$scope.$emit('catebar.change',{name:$scope.name,data:$scope.selectedData});

				};

				$scope.listen = function(){
					$scope.$on('catebar.setMetadata',function(e,args){
						// args ->{name:..,data:..}
						var name = args.name;
						if(name!=$scope.name){return;}

						var data = args.data;
						var title = args.title;

						// if(hasAll){
						// 	data.unshift({value:-1,text:'全部'});
						// };
						$scope.setMetadata(title,data);
						// 选择第一个
						// $scope.select($scope.data[0].value);
						$scope.$emit('catebar.change',{name:$scope.name,data:$scope.selectedData});
						
					});
				};

				$scope.listen();

			}
		}
	}]);
});