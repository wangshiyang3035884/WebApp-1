var http = require('http');
var logger = require('../utils/logger');
var config = require('../model/config');
var ctlrouter = require("../controller/ctlrouter.js");
var httpServlet = http.createServer(function(request,response){
    ctlrouter.route(request,response);   
});
function connectionCall(error,count){
    //console.log(error,count);
}
process.on('message', function(news,socket){
	process.nextTick(function(){
		if(news == config.CONNECTION && socket) {
			socket.readable = socket.writable = true;
			socket.resume();
            if('getConnections' in httpServlet){
                httpServlet.getConnections(connectionCall);
            }else{
                httpServlet.connections++;
            }
            socket.server = httpServlet;
            //触发http模块的connection事件将socket连接
            httpServlet.emit("connection",socket);
            httpServlet.emit("connect");
            socket = null;
        }else{
            switch(news.command){
                case config.STRUTS:
                  ctlrouter.struts(news.data);
                  break;
                default:
            }            
        }
    });
 });           
//监听异常退出输出日志
process.on('uncaughtException', function(error) {
    logger.info(error);
}); 