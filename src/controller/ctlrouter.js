var url = require("url");
var path = require('path'); 
var tpl = require('../view/tpl');
var utils = require('../utils/utils');
var config = require('../model/config');
var logger = require('../utils/logger');
var httpoutput = require('../server/httpOutput');
var actionmap,tplmap,strutsmap,tplcmap,aopmap;
/**
 * 路由请求处理
 * @param handle 处理对象
 * @param pathname 路由key
 */
function route(request,response) {
    var action,key = url.parse(request.url).pathname;
    if(strutsmap && key in strutsmap){
        action = new actionmap[key]();
        action.init(servlet,key,request,response);
        action[strutsmap[key]["method"]]();
    }else{     
        if(key.slice(-1) === "/"){
          key = "/index.html";
        }  
        output(request,response,key);
    }
}
function servlet(name){
    var tpl_c,tpldata,map = strutsmap[this.actionkey].result;
    if(name && name in map){
        map = map[name];
        switch(map.type){
            case "json":
              if(utils.istype(this.results)=="Object"){
                tpldata = JSON.stringify(this.results);
              }else{
                tpldata = this.results;
              }
              this.context.writeData(tpldata);
              this.release();
              break;
            case "freemarker":
              if(map.value in tplmap){
                tpldata = {};
                tpldata[map.param] = this.results;
                tpl_c = tpl.rendertpl(map.value,tpldata);
                this.context.setHeads("Content-Type","text/html;charset=utf-8"); 
                this.context.writeData(tpl_c);
                this.release();                   
              }              
              break;
            case "forward":
              output(this.context.getRequest(),this.context.getResponse(),map.value);                       
              break;              
            default:
        }        
    }   
}
function output(request,response,name){ 
    var mime,extname,matched,tpl_c = config.tplcpath+"/404.html";
    if(name in tplcmap){
        tpl_c = config.tplcpath+name; 
        if(tplcmap[name]=="matched"){
            matched = true;
        }                
    }
    extname = path.extname(tpl_c).slice(1); 
    mime = config.mime[extname] || "text/plain"; 
    httpoutput.output(tpl_c,request,response,mime,matched);                 
}
function aopcomb(cut,res){
  var queue,advice,origclass,origfun,newfun,joinpoint = cut['joinpoint'],method = cut['method'];
  origclass = cut["class"];
  advice = cut["advice"];
  queue = [];
  if((joinpoint in res.prototype) && (method in origclass.prototype)){
    origfun = res.prototype[joinpoint];
    newfun = origclass.prototype[method];
    switch(advice){
      case "before"://逻辑之前切入
        queue.push(newfun,origfun);
        break;
      case "after"://逻辑之后切入
        queue.push(origfun,newfun);
        break;
      case "around"://逻辑前后切入
        queue.push(newfun,origfun,newfun);
        break;
      case "replace"://替换原有逻辑
        res.prototype[method] = newfun;               
      default:
       return;
    }
    res.prototype[method] = function(){
      for(var i=0,len=queue.length;i<len;i++){
        queue[i].apply(this, arguments);
      }
    } 
  }
}
/**
 * 路由请求处理
 * @param handle 处理对象
 * @param pathname 路由key
 */
function struts(data) {
  var strut,pointcut;
  actionmap = {};
  tplmap = data.tpl;
  tplcmap = data.tplc;
  aopmap = data.aop;
  strutsmap = data.action;
  for(var key in aopmap){
    aopmap[key]["class"] = require('../'+aopmap[key]["class"]);
  }
  for(key in strutsmap){
    strut = strutsmap[key];
    actionmap[key] = require('../'+strut["class"]);
    if("pointcut" in strut){
      pointcut = strut["pointcut"];
      aopcomb(aopmap[pointcut],actionmap[key]);
    }
  }
}
module.exports = {'route':route,'struts':struts};