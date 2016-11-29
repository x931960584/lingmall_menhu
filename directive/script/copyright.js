define(["app"],function(app){
	app.directive("lmcopyright",function(){
		return {
			restrict:"E",
			templateUrl:"../directive/html/copyright.html",
			link:function($scope,$el){
			}
		};
	});
});