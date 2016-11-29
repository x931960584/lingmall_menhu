define(["app",
		"tool-confirmlogin",
		"directive-headbar",
		"directive-copyright"
	],function(app){
	app.directive("lmserviceentrance",[function(){
		return {
			restrict:"E",
			templateUrl:"../directive/html/serviceentrance.html",
			link:function($scope,$element,$attrs){
				
			}
		}
	}])
});