define(["app","underscore",'config',"jquery","async","jszip","fileSaver"],function(app,_,config,$,async,JSZip){
	var host = config.imgServiceUrl;
	var port = config.imgServicePort;
	var token = config.imgServiceToken;
	
	var _myReq = function(type,path,params,next){
		var url = host+":"+port+"/"+path;
		params.token = token;
		$[type](url,params,function(data){
			//console.info("imgservice",data);
			next&&next(null,data);
		});
	};

	var myGet = _myReq.bind(null,"get");
	var myPost = _myReq.bind(null,"post");

	/**
	*  图片相关服务,包括获取图片,下载图片等等
	* @namespace imageService
	*/
	app.service("lmImgService",function(){
		/**
		* 获取缩略图
		* @alias getThumb22
		* @memberof imageService
		* @param {Array} skuIds 图片唯一标识数组
		* @param {Function} next 回调,返回图片信息
		* @return {Void}
		*/
		this.getThumb = function(skuIds,next){
			var path = "lingmall/pictures/thumbnail";
			var params = _.map(skuIds,function(n){
				return "sku_id="+n;
			}).join("&");
			params += "&token="+token;
			myGet(path,params,next);
		};

		/**
		* 获取特定尺寸展示图片
		* @alias getPics
		* @memberof imageService
		* @param {String} skuId 图片唯一标识
		* @param {Number} [xType=2] 图片尺寸
		* @param {Function} next 回调,返回图片信息
		* @return {Void}
		*/
		this.getPics = function(skuId,xType,next){
			var path = "lingmall/pictures";
			var params = {sku_id:skuId,xType:xType||2};
			myGet(path,params,next);
		};

		/**
		* 返回完成的图片路径
		* @alias getFullurl
		* @memberof imageService
		* @param {String} parturl 图片基本路径
		* @param {Number} sizeType 图片规格(枚举)
		* 50(无水印，75%质量)
		* 100(无水印，75%质量)
		* 500(有水印，75%质量)
		* 1000(有水印，75%质量)
		* hp500(无水印，100%质量，用于下载)
		* @return {String} 完整的图片路径
		*/
		this.getFullurl = function(parturl,sizetype){
			var sizetype = /^\d+$/.test(sizetype)?("-thumbnail"+sizetype):"-"+sizetype;
			return parturl+sizetype;
		};

		/**
		* 获取图片数据
		* @private
		* @alias getZip
		* @memberof imageService
		* @param {String} skuId 商品唯一标识
		* @param {String} zip JSZIP实例
		* @param {String} basepath 在zip包中的路径
		* @param {Function} next 回调,用以告知调用方请求结束
		* @return {Void} 
		*/
		this.getZip = function(skuId,zip,basepath,next){
			var self = this;
			async.parallel({
				"thumb":function(cb){
					self.getThumb([skuId],function(err,data){
						cb(null,data);
					});
				},
				"pics":function(cb){
					self.getPics(skuId,null,function(err,data){
						cb(null,data);
					});
				}
			},function(err,data){
				var arr = [];
				arr.push(["缩略图",data.thumb[0]]);
				arr.push(["主图",data.pics[1]]);
				arr.push(["细节图",data.pics[2]]);
				arr.push(["标签图",data.pics[3]]);
				arr.push(["营销图",data.pics[6]]);
				async.each(arr,function(n,cb){
					// 有的商品,在个别的图是没有的
					if(!n[1]){cb();}
					else if(!_.isArray(n[1])){
						self.getImgData(self.getFullurl(n[1].domain+'/'+n[1].key,"hq500"),function(err,data){
							zip.file(basepath+n[0]+".jpg",data);
							cb();
						});
					}else{
						zip.folder(basepath + n[0]);
						var index = 0;
						async.each(n[1],function(nn,cb2){
							self.getImgData(self.getFullurl(nn.domain+'/'+nn.key,"hq500"),function(err,data){
								var filename = basepath + n[0]+"/"+index+".jpg";
								index++;
								zip.file(filename,data);
								cb2();
							});
						},function(){
							cb();
						});
					}
				},function(err,data){
		            next();
				});
			});
		};
	
		/**
		* 获取特定尺寸展示图片
		* @alias getZipPro
		* @memberof imageService
		* @param {(Object|Object[])} list {商品唯一标识,code}(数组?)
		* @return {Void}
		*/
		// this.getZipPro = function(skuIdList,refer){
		// 	var self = this;
		// 	codeList = !_.isArray(codeList) ? [codeList] : codeList;
		// 	refer = !_.isArray(refer) ? [refer] : refer;
		// 	var zip = new JSZip();
		// 	var i = 0;
		// 	async.each(codeList,function(code,cb){
		// 		var basepath = code+"/";
		// 		zip.folder(code);
		// 		self.getZip(code,refer[i],zip,basepath,function(err,data){
		// 			cb();
		// 			i = i + 1;
		// 		});
		// 	},function(err,data){
		// 		var content = zip.generate({type:"blob"});
	 //            saveAs(content, Date.now()+".zip");
		// 	});
		// };

		this.getZipPro = function(list){
			var self = this;
			list = !_.isArray(list) ? [list] : list;
			var zip = new JSZip();
			var dict={};
			async.each(list,function(item,cb){
				var code = item.code,
				skuId = item.skuId;

				var codeIndx = dict[code] = dict[code] ? dict[code]+1 : 1;
				var folderName = (code+'('+(codeIndx-1)+')').replace('(0)','');
				zip.folder(folderName);
				self.getZip(skuId,zip,folderName+'/',cb);
			},function(err,data){
				var content = zip.generate({type:'blob'});
				saveAs(content,Date.now()+'.zip');
			});
		};


		/**
		* 获取图片数据
		* @private
		* @alias getImgData
		* @memberof imageService
		* @param {String} url 图片路径
		* @param {Function} next 回调,返回图片的二进制数据
		* @return {Void} 
		*/
		this.getImgData = function(url,next){
			var xhr = new XMLHttpRequest();    
			xhr.open("get", url, true);
			xhr.responseType = "arraybuffer";
			xhr.onload = function() {
				if (this.status == 200) {
					next(null,this.response);
				}else{
					next(true);
				}
			}
			xhr.send();
		};

		/**
		* 下载部分图片
		* @alias getImgSingle
		* @memberof imageService
		* @param {(String|String[])} imgList 图片路径(数组?)
		* @param {String} code 商品条形码
		* @return {Void} 
		*/
		this.getImgSingle = function(imgList,code){
			var self = this;
			imgList =!_.isArray(imgList)?[imgList]:imgList;
			var zip = new JSZip();		
			var index = 0;
			async.each(imgList,function(n,cb){
				self.getImgData(n,function(index,err,data){
					zip.file(code+"/"+index+".jpg",data);
					cb();
				}.bind(null,index));
				index++;
			},function(err,data){
				var content = zip.generate({type:"blob"});
	            saveAs(content, Date.now()+".zip");
			});
		};

	});
});