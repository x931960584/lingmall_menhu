define(["app","underscore","jquery","cookie"],function(app,_,$,cookie){
	app.service("lmUtilService",["$location",function($location){
		this.linkTo = function(path,isNewTab){
			if(isNewTab){
				var anchor = "#"+path;
				var anode = $("<a href='"+anchor+"' target='_blank'></a>");
				$("body").append(anode);
				anode[0].click();
				anode.remove();
			}else{
				$location.path(path);
			};
		};	
	}]);
});
