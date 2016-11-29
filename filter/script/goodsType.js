// 商品
define([
		'app'
	],function(app){
		app.filter('goodsType',[function(){
 			return function(classId){
				var dict = {
					1:'快消食品'
				};
				return dict[classId];
			};
		}]);
	}
);