define(["app"],function(app){
	app.directive("lmbatchsearchbtn",function(){
		return {
			restrict:"A",
			link:function($scope,$element,$attrs){
			// 初始化csv上传控件
			$scope.initCsvUploader = function() {
				$($element).change(function() {
					var file = $(this)[0].files[0];
					if (/\.csv$/.test(file.name)) {
						var reader = new FileReader();

						reader.onload = function(e) {
							var content = this.result;
							var data = content.split('\n').slice(1);

							data = _.filter(data, function(n) {
								return /^\d+$/.test(n - 0) && n.replace(/\s/g, '') + '' != '';
							});
							data = _.map(data, function(n) {
								return (n + '').replace('\r', '');
							});

							$scope.batchSearch(data);
						};

						//读取文件内容  
						reader.readAsText(file);
					} else {
						alert("只支持csv格式文件上传!");
					}
				});
			};

			// 批量搜索
			$scope.batchSearch = function(data){
				//console.log('csv data',data);
				$scope.$emit('batchSearch.beforeSearch',data);
			};


			$scope.initCsvUploader();
			}
		};

	});

});