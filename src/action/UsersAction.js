var util = require('util');
var http = require('http');
var crypto = require('crypto'); 
var mysql = require('../model/db/mysqldb');
var sqlconfig = require('../model/sqlconfig');
var ActionSupport = require('../struts/ActionSupport');
function UsersAction(){
	ActionSupport.call(this);
}
util.inherits(UsersAction,ActionSupport);//使这个类继承ActionSupport  
UsersAction.prototype.adminverify = function(){	
	return false;
}
UsersAction.prototype.loginAction = function(){
	var md5,self = this,name = this.context.getQuery("name"),password = this.context.getQuery("password");
	if(name && password){
		md5 = crypto.createHash('md5');
		md5.update(password);
		password = md5.digest('hex');
		md5 = null;	
		mysql.pool(sqlconfig.insert_user,[name,password],function(err, results) {	
			if(!err) {
				self.results = {"login":1,'news':"注册成功"};
				self.context.setCookie("login",1);	
				self.context.setCookie("uid",results.insertId);			
			}else{
				self.results = {"login":0,'news':"注册失败"};
			}
			self.execute("success");
		});		
	}else{
		this.results = {"login":0,'news':"注册失败"};
		this.execute("success");
	}
}
UsersAction.prototype.landedAction = function(){
	var md5,self = this,name = this.context.getQuery("name"),password = this.context.getQuery("password");
	if(name && password){
		md5 = crypto.createHash('md5');
		md5.update(password);
		password = md5.digest('hex');
		md5 = null;	
		mysql.pool(sqlconfig.landed_user,[name,password],function(err, results) {	
			if(!err && results.length) {
				self.results = {"login":1,'news':"登录成功"};
				self.context.setCookie("uid",results[0].uid);
				self.context.setCookie("login",1);				
			}else{
				self.results = {"login":0,'news':"登录失败"};
				self.context.setCookie("login",0);
			}
			self.execute("success");
		});			
	}else{
		this.results = {"login":1,'news':"登录失败"};
		this.context.setCookie("login",0);
		this.execute("success");
	}
}
UsersAction.prototype.indexAction = function(){
	var self = this,login = this.context.getCookie("login"),uid = this.context.getCookie("uid");
	if(login=='1' && uid!="" && this.adminverify(uid)){
		mysql.pool(sqlconfig.select_user,[uid],function(err, results) {	
			if(!err && results.length) {
				results = results[0];
				self.results = {"uid":results.uid,"name":results.name,"type":results.type};
				self.execute("main");			
			}else{
				self.execute("login");
			}
		});	
	}else{
		this.execute("login");
	}
}
UsersAction.prototype.videoAction = function(){
	var self = this,request,query = this.context.getQueryString(),options = {
	  hostname: 'www.baofengcloud.com',
	  port: 80,
	  path: '/video/getvideolist?'+query,
	  method: 'GET',
	  headers:{
	    "Accept":"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01",
	    "Accept-Encoding":"gzip,deflate,sdch",
	    "Accept-Language":"zh-CN,zh;q=0.8",
	    "Host":"www.baofengcloud.com",
	    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36",
	    "Cookie":"cuid=%257B%2522userid%2522%253A%25222%2522%252C%2522username%2522%253A%2522karon%2522%257D; tk=cfd4895ade147d4d645832d7d27b370237645d05; PHPSESSID=600012519342696a67a7c1fdd2b50dfa; c_servicetype=1"
	  }
	};
	request = http.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(data){
			if(res.statusCode == 200){
				self.results = data;
			}else{
				self.results = {"news":"请求失败"};
			}
			self.execute("success");			
		});
		request = null;
	});
	request.on('error', function(error) {
		self.results = '代理请求异常: ' + error.message;
		self.execute("success");
		request = null;
	});
	request.end();
}
module.exports = UsersAction;