define(["app"],function(app){
	app.directive("lmcustomservice",["$rootScope",function($rootScope){
		return {
			restrict:"E",
			templateUrl:"../directive/html/customservice.html",
			link:function($scope) {
				/*$scope.Currentpage=0;
				var BeginTop=510;
				var OriginWindowHeight=0;
				document.body.scrollTop=0;
				var OriginTop=document.body.scrollTop;
				var PageHeightRate=[];
				var AutoPageWorking=0;
				var t = setInterval(function(){
					if(OriginWindowHeight!=window.innerHeight){
						OriginWindowHeight=window.innerHeight;
						$scope.tagbox_height=window.innerHeight-186;
						$scope.tagbox_paddingtop=Math.floor($scope.tagbox_height*0.23);
						GenPageHeightRate(window.innerHeight-186);
						$scope.$apply();
					}
					if(AutoPageWorking==0&OriginTop!=document.body.scrollTop){
						var act={wheelDelta:OriginTop-document.body.scrollTop}
						AutofocusPage(act);
					}
					if(typeof(CustomModal)=='object'){
						AnimateTurnPage();
					}
				},15);

				$scope.$on("$destroy",function(){
					clearInterval(t);
				});

				//重新生成分页高度
				function GenPageHeightRate(windowheight){
					PageHeightRate=[0,BeginTop,BeginTop+windowheight*1,BeginTop+windowheight*2];
					//console.log(PageHeightRate);
				}
				//鼠标滚动回调
				var AutofocusPage=function(e){
					e=e||window.event;
					var direction=e.wheelDelta||e.detail;
					//console.log(e.wheelDelta);
					//阻止滚动默认行为
					if(typeof(CustomModal)=='object'){
						if(window.attachEvent){
							//e.preventDefault();	//moz
						}
						else{
							e.returnValue = false;	//webkit
						}
					}
					
					if(AutoPageWorking==0){
						if(e.wheelDelta>0&0<$scope.Currentpage){
							AutoPageWorking=1;
							$scope.Currentpage=$scope.Currentpage-1;
						}
						if(e.wheelDelta<0&(PageHeightRate.length-1)>$scope.Currentpage){
							AutoPageWorking=1;
							$scope.Currentpage=$scope.Currentpage+1;
						}
						//console.log('Currentpage:'+$scope.Currentpage);
						//console.log('AutoPageWorking:'+AutoPageWorking);
					}
				}
				//滚动翻页
				function AnimateTurnPage(){
					var BodyTop=document.body.scrollTop;
					var DirectInt=PageHeightRate[$scope.Currentpage]-BodyTop;
					var AnimateRate=1;
					//Swing 效果
					if(DirectInt>0){
						if(DirectInt>800){
							AnimateRate=AnimateRate+10;
						}
						if(DirectInt>300){
							AnimateRate=AnimateRate+8;
						}
						if(DirectInt>100){
							AnimateRate=AnimateRate+6;
						}
						if(DirectInt>50){
							AnimateRate=AnimateRate+4;
						}
						if(DirectInt>10){
							AnimateRate=AnimateRate+5;
						}
						OriginTop=BodyTop+AnimateRate;
						document.body.scrollTop=OriginTop;
					}
					if(DirectInt<0){
						if(DirectInt<-800){
							AnimateRate=AnimateRate+10;
						}
						if(DirectInt<-300){
							AnimateRate=AnimateRate+8;
						}
						if(DirectInt<-100){
							AnimateRate=AnimateRate+6;
						}
						if(DirectInt<-50){
							AnimateRate=AnimateRate+4;
						}
						if(DirectInt<-10){
							AnimateRate=AnimateRate+2;
						}
						OriginTop=BodyTop-AnimateRate;
						document.body.scrollTop=OriginTop;
					}
					if(PageHeightRate[$scope.Currentpage]==BodyTop&AutoPageWorking==1){
						OriginTop=document.body.scrollTop;
						AutoPageWorking=0;
						//console.log('AutoPageWorking:'+AutoPageWorking);
					}
				}
				//注册鼠标滚轮事件
				function RegEventMouseWheel(){
					if(document.addEventListener){
						document.addEventListener('DOMMouseScroll',AutofocusPage,false);
					}//FireFox
					window.onmousewheel=document.onmousewheel=AutofocusPage;//IE/Opera/Chrome
				}
				RegEventMouseWheel();
				*/
			}
		};
	}]);
});