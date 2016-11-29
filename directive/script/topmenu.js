
define(["app"],function(app){
	app.directive("lmtopmenu",function(){
		return {
			restrict:"E",
			templateUrl:"../directive/html/topmenu.html",
			link:function($scope,$el){
			}
		};
	});
});