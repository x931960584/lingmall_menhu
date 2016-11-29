define([],function(){
	var conf;
	if(isProduct){
		conf = {
			imgServiceUrl:'http://139.196.36.81',
			imgServicePort:'8600',
			imgServiceToken:'Eahtug4w93YNu99a30o9m_MjHO8Qcz3bv8KlXmWcVORRULm9FuJGhyNkOg4Pda8n',
			goodsServiceUrl:'http://api.lingmall.com:8001',
			payServiceUrl:'http://api.lingmall.com:8001',
			userServiceUrl:'http://api.lingmall.com:8002',
			// 零猫后台登陆页面
			backendUrl:'http://admin.lingmall.com/#/login'	
		};
	}else{
		conf = {
			imgServiceUrl:'http://139.196.36.81',
			imgServicePort:'8400',
			imgServiceToken:'7jsD03yg64t1kPuOANJxBI1dMpzfvUgkaBr9y11Ybg1M9X3N-54ptlhgaJjXDeqE',
			goodsServiceUrl:'http://192.168.1.240:8001',
			payServiceUrl:'http://192.168.1.240:8001',
			userServiceUrl:'http://192.168.1.240:8002',
			// 零猫后台登陆页面
			backendUrl:'http://192.168.1.240:8004/#/login'	
		};
	}

	return conf;
});
