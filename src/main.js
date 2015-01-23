var os = require("os");
var fs = require("fs");
var net = require('net');
var path = require('path'); 
var http = require('http');
var worker = require('child_process');
var config = require('./model/config');
var logger = require('./utils/logger');
var struts = require('./struts/InitializationStruts');
var map,fork,httpServlet,port = 80,workers = [];
/**
* 第一次读取缓存目录下面的文件
* 生成map文件避免频繁读取文件是否存在
**/
function createtpl(src,directory,sion){
  var walk,len,tpls = {};
  if(sion){
  	len=sion.length;
  }
  walk = function(src){
  	files = fs.readdirSync(src);
  	files.forEach(function(item) {  
  		var tplpath = src + '/' + item,stats = fs.statSync(tplpath);
        if (stats.isDirectory()) {  
            walk(tplpath); 
        } else {
        	if(sion){
        		if(tplpath.indexOf(sion,tplpath.length-len)){
        			tpls[tplpath.replace(directory,"")] = true;
        		}
        	}else{
        		if(path.extname(tplpath).slice(1).match(/^(gif|png|jpg|js|css)$/ig)){
        			tpls[tplpath.replace(directory,"")] = 'matched';
        		}else{
        			tpls[tplpath.replace(directory,"")] = true;
        		}
        	}
        }  
    });  
  };  
  walk(src);
  return tpls;
}
/**
* 初始化创建对应cpu数量的子进程
**/
function createworker(){
	for(var i=0,cpus = os.cpus().length;i<cpus;i++){
		fork = worker.fork(config.workerpath,['normal']);
		fork.send({'command':config.STRUTS,'data':map});
		workers.push(fork);
	}	
}
httpServlet = net.createServer(function(socket){
  socket.pause();
  fork = workers.shift();
  fork.send(config.CONNECTION,socket,{track:false,process:false});
  workers.push(fork);
});
httpServlet.on('error', function (error) {
	if(error.code == 'EADDRINUSE') {
       logger.info('服务端口被占用');
    }
});
/**
* 服务器开启成功
**/
httpServlet.listen(port, function() {
  var configs = struts.InitStruts(config.strutspath);
	map = {};
  map.aop = configs[0];
  map.action = configs[1];
	map.tpl = createtpl(config.tplpath,config.tplpath,'.ejs');
	map.tplc = createtpl(config.tplcpath,config.tplcpath);
  configs = null;
	createworker();
	logger.info('服务开启'); 
}); 
/**
* 退出输出日志
**/
process.on('exit', function(error) {
   logger.info("服务器退出"); 
});
/**
* 监听异常退出输出日志
**/
process.on('uncaughtException', function(error) {
    logger.info(error); 
}); 