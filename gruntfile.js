module.exports = function (grunt) {  
	require("colors");
	// show elapsed time at the end  
	require('time-grunt')(grunt);  
	// load all grunt tasks  
	require('load-grunt-tasks')(grunt);  
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// grunt.loadNpmTasks('grunt-jsdoc');

	grunt.initConfig({  
		watch: {  
			livereload: {  
				options: {  
					livereload: '<%= connect.options.livereload %>'    
				},  
				files: [
					'main.html',
					'seaconfig.js',
					'view/**/*.{html,htm}', 
					'directive/**/*.{html,htm}', 
					'script/**/*.js', 
					'css/bundle.css',
					'service/dist/*.js',
					'controller/dist/*.js',
					'filter/dist/*.js'
					// ,
					// '<%= jsdoc.dist.options.destination%>/*.html'
				]  
			},
			less:{
				files:[
					'less/**/*.less',
					'directive/less/**/*.less'
				],
				tasks:["less"]
			},
			directive:{
				files:['directive/script/**/*.js'],
				tasks:['lessChangedAlert',"concat"]
			},
			filter:{
				files:['filter/script/**/*.js'],
				tasks:['lessChangedAlert',"concat"]
			},

			service:{
				files:['service/script/**/*.js'],
				tasks:["concat"]
			},
			controller:{
				files:['controller/script/**/*.js'],
				tasks:["concat"]
			},
			// jsdoc
			// genDoc:{
			// 	files:['<%= jsdoc.dist.src%>'],
			// 	tasks:['jsdoc']
			// }
		},
		less:{
			dev:{
				files:{
					// "css/bundle.css":["less/**/*.less","directive/less/**/*.less"]
					"css/bundle.css":'<%= watch.less.files %>'
				}
			}
		} ,
		connect: {  
			options: {  
				port: 9001,  
				livereload: 35731,  
				// change this to '0.0.0.0' to access the server from outside  
				hostname: 'localhost'  
			},  
			livereload: {  
				options: {  
					open: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/main2.html',  
				}  
			},
			genDoc:{
				options:{
					open:'http://<%= connect.options.hostname %>:<%= connect.options.port %>/<%= jsdoc.dist.options.destination%>/index.html'
				}
			},
			produce:{
				options:{
					open:'http://<%= connect.options.hostname %>:<%= connect.options.port %>/main.html'
				}
			}
		},
		concat:{
			options: {
			  separator: ';',
			},
			directive: {
			  src: '<%= watch.directive.files %>',
			  dest: 'directive/dist/directive-bundle.js',
			},
			filter: {
			  src: '<%= watch.filter.files %>',
			  dest: 'filter/dist/filter-bundle.js',
			},
			service:{
			  // src: ['service/script/**/*.js'],
			  src: '<%= watch.service.files %>',
			  dest: 'service/dist/service-bundle.js',
			},
			controller:{
			  src: '<%= watch.controller.files %>',
			  dest: 'controller/dist/controller-bundle.js',
			}
		} ,
		jsdoc: {
			dist: {
				src: ['service/script/*.js','script/*.js'],
				options: {
					destination: 'doc',
					   template : "node_modules/ink-docstrap/template",
					  configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
				}
			}
		},
		requirejs: {
			compile: {
				options: {
				baseUrl: "./",
				mainConfigFile: "script/main.js",
				// name: "path/to/almond",
				/* 
				assumes a production build using almond, if you don't use almond, you
				need to set the "includes" or "modules" option instead of name 
				*/
				// optimize: "none",
				include: [ "script/main.js" ],
				out: "minSrc/min.js"
				}
			}
		},
		//js代码检查
		jshint: {
			all:[
				'controller/script/**.js',
				'directive/script/**.js',
				'service/script/**.js',
				'script/**.js'
				],
			options: {
				browser:true,
				devel:true
			}
		}
	});  


	grunt.registerTask("lessChangedAlert",function(){
		console.log("compile less file ... ".green);
	});

	grunt.registerTask('compile',function(){
		grunt.task.run([
			'lessChangedAlert',
			'less',
			'concat'
		]);
	});

	grunt.registerTask('serve', function () {  
		grunt.task.run([  
			'compile',  
			'connect:livereload',  
			'watch'
		]);  
	});  

	grunt.registerTask('genDoc',function(){
		grunt.task.run([
			'jsdoc',
			'connect:genDoc',
			'watch'
		]);
	});

	grunt.registerTask('produce',function(){
		grunt.task.run([
			'compile',
			'requirejs',
			'connect:produce'
		]);
	});

	grunt.registerTask('viewProduce',function(){
		grunt.task.run([
			'connect:produce',
			'watch'
		]);
	});

	grunt.registerTask('grunt-contrib-jshint');
  
	grunt.registerTask('default', ['serve']);  
};  