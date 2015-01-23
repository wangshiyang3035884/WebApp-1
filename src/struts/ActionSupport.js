var ServletActionContext = require("./ServletActionContext");
function ActionSupport(){
	this.servlet = null;	
	this.actionkey = null;
	this.results = {};
	this.context = new ServletActionContext();
}
ActionSupport.prototype.init = function(servlet,key,request,response){
	this.context.setRequest(request);
	this.context.setResponse(response) ;
	this.servlet = servlet;
	this.actionkey = key;
}
ActionSupport.prototype.validate = function(){
	return true;
}
ActionSupport.prototype.execute = function(resultName){
	if(!this.validate()){
		resultName = "error";		
	}
	this.servlet.call(this,resultName);
}
ActionSupport.prototype.release = function(){
	this.context.release();
	this.results = null;
	this.servlet = null;	
	this.actionkey = null;
}
module.exports = ActionSupport;