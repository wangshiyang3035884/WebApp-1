var url = require("url");
var utils = require('../utils/utils');
var querystring = require('querystring');
function postdata(data){
  return querystring.parse(data);
}
function getdata(request){
  return querystring.parse(url.parse(request.url).query);
}
function getcookie(request){
  return querystring.parse(request.headers.cookie,"; ","=");
} 
function requestheaders (name, data) {
  var temp;
  if (name == '') {
    return data;
  }
  if(utils.istype(name) == 'Array') { //数组形式传递进来
    temp = {};
    for(var i = 0,l = name.length;i<l;i++){
      if(data[name[i]]){
        temp[name[i]] = data[name[i]];
      }else{
        temp[name[i]] = '';
      }
    }
    return temp;
  }else{
    if(data[name]){
      return data[name];
    }else{
      return '';
    }
  }
}
function ServletActionContext(){
  this.request = null; //request对象
  this.response = null;//response对象
  this.cookiemap = null;
  this.postdata = null;
  this.getdata = null;
  this.headcode = 200;
  this.cookielist = []; //存放cookie输出数据
  this.headmap = {"Content-Type":"text/plain;charset=utf-8"};
}
ServletActionContext.prototype.getRequest = function(){
  return this.request;
}
ServletActionContext.prototype.getResponse = function(){
  return this.response;
}
ServletActionContext.prototype.getHeaders = function(name){
  return requestheaders(name,this.request.headers);
}
ServletActionContext.prototype.setRequest = function(request){
  this.request = request;
  this.getdata = getdata(request);
  this.cookiemap = getcookie(request);
}
ServletActionContext.prototype.setResponse = function(response){
  this.response = response;
}
ServletActionContext.prototype.getClientIp = function(){
  var ipAddress,forwardedIps,forwardedIpsStr = this.GetHeaders('x-forwarded-for'); 
  if(forwardedIpsStr){
    forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if(!ipAddress){
    ipAddress = this.request.connection.remoteAddress;
  }
  return ipAddress;  
}
ServletActionContext.prototype.setHeads  = function(name,value){
  this.headmap[name] = value;
}
ServletActionContext.prototype.setCode  = function(code){
  this.headcode = code;
}
ServletActionContext.prototype.writeData  = function(data){
  this.headmap["Set-Cookie"] = this.cookielist;
  this.response.writeHead(this.headcode,this.headmap); 
  if(data){
    this.response.write(data,""); 
  }
  this.response.end();  
}
ServletActionContext.prototype.setCookie  = function(name, value, expires, path, domain){
  var cookie = name + '=' + value + ';',today,new_date,expiresDate;
  if(expires != undefined) {//cookie有效期时间
    today = new Date();
    new_date = new Date(today.getTime() + parseInt(expires) * 1000);
    expiresDate = new_date.toGMTString(); //转换成 GMT 格式。
    cookie += 'expires=' +  expiresDate + ';';
  }
  if(path != undefined){//目录
    cookie += 'path=' +  path + ';'; 
  }
  if (domain != undefined) {//域名
    cookie += 'domain=' +  domain + ';'; 
  }
  this.cookielist.push(cookie);
  return true;
}
ServletActionContext.prototype.delCookie  = function(name){
  this.setCookie(name,'',-999);
  return true;  
}
ServletActionContext.prototype.getCookie  = function(name){
  return requestheaders(name,this.cookiemap);
}
ServletActionContext.prototype.getQuery  = function(name){
  return requestheaders(name,this.getdata);
}
ServletActionContext.prototype.getQuerymap  = function(name){
  return this.getdata;
}
ServletActionContext.prototype.getQueryString  = function(name){
  return url.parse(this.request.url).query;
}
ServletActionContext.prototype.release  = function(){
  this.request = null; //request对象
  this.response = null;//response对象
  this.cookiemap = null;
  this.postdata = null;
  this.getdata = null;
  this.headcode = null;
  this.cookielist.length = 0;
  this.cookielist = null;
  this.headmap = null;
}
module.exports = ServletActionContext;