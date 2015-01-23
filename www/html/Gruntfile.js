var plugins = require("./grunt_modules/plugins");
module.exports = function (grunt) {
    var zipjs,compileJsConfig,config;    
    config = {
        pkg: grunt.file.readJSON('./package.json'),
        path: grunt.file.readJSON('./grunt_modules/config.json'),
        less: { // 编译 LESS 文件
            compile: {
                files: {
                    '<%= path.style %>main.css':['<%= path.less %>main.less'],
                    '<%= path.style %>login.css':['<%= path.less %>login.less']
                }
            }
        },
        cssmin: { // 压缩 CSS 文件
            options: {
                report : "min"
            },
            combine: {
                files: {
                  '<%= path.style %>main.min.css': '<%= path.style %>main.css',
                  '<%= path.style %>login.min.css': '<%= path.style %>login.css'
                }
            }
        },
        uglify: {// 压缩合并 JS 文件
            options: {
                report:'min',
                expand: true,
                mangle: true,//true
                preserveComments: 'false',//false
                beautify: {
                    ascii_only: true//中文ascii化,防止中文乱码
                },
                banner: '/** \n' +//生成注释
                        ' * -------------------------------------------------------------\n' +
                        ' * Copyright (c) 2014 baofeng, All rights reserved. \n' +
                        ' * http://www.baofeng.com/ \n' +
                        ' *  \n' +
                        ' * @version: <%= pkg.version%> \n' +
                        ' * @author: <%= pkg.author%> \n' +
                        ' * @description: <%= pkg.description%> \n' +
                        ' * @date: <%=grunt.template.today("yyyy-mm-dd  HH:MM:ss")%>\n' +
                        ' * ------------------------------------------------------------- \n' +
                        ' */ \n\n'
            }
        }
    };
    zipjs = {//压缩配置
        zepto: {
            minname : config.path.script+'libs/zepto.min.js',
            dstname : [config.path.zepto +'zepto.js',config.path.zepto +'touch.js']
        },        
        main : {
            namespace : "baofeng.main",
            minname : config.path.script+'main.min.js'
        },        
        login : {
            namespace : "baofeng.login",
            minname : config.path.script+'login.min.js'
        },        
        test : {
            namespace : "baofeng.test",
            minname : config.path.script+'test.min.js'
        }         
    };
    compileJsConfig = function (config) {
        var json,data;
        plugins.deps(config.path.rely,config.path.deps);
        for(var key in zipjs){
            data = zipjs[key];
            if(!('dstname' in data)){
                data.dstname = plugins.init(data.namespace,config.path.deps);
            }
        }        
        for (var key in zipjs) {//需要压缩的代码
            json = {}
            json[zipjs[key].minname] = zipjs[key].dstname;
            config.uglify[key] = {files:json};
        }
        return config;
    };    
    grunt.initConfig(compileJsConfig(config));
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.task.registerTask('cache','',function(){
        plugins.upcache(config.path.caches,config.path.cachepath,config.pkg.version);
    });
    grunt.task.registerTask('deps','',function(){
        plugins.deps(config.path.rely,config.path.deps);
    });      
    grunt.task.registerTask('min','',function(){
        for(var key in zipjs){
            plugins.min(zipjs[key].minname);
        }  
    });   
    grunt.registerTask('lessc', ['less','cssmin']); 
    grunt.registerTask('jszip', ['deps','uglify','min','cache']);      
    grunt.registerTask('build', ['less','cssmin','deps','uglify','min','cache']);
};
