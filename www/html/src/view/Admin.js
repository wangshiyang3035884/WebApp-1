/**
 * 用户 user
 * User: ningxiao
 * Date: 13-3-19
 * Time: 下午3:06
 */
baofeng.utils.provide("baofeng.user.Admin");
baofeng.utils.require("baofeng.ui.Component");
baofeng.user.Admin = function (){
	this.uservo = null;
}
baofeng.utils.inherits(baofeng.user.Admin,baofeng.ui.Component);
baofeng.user.Admin.TIMEOUT = 3000;
baofeng.user.Admin.prototype.renderingview = function(){
	document.body.innerHTML="登陆成功"+this.uservo.GetName()+this.uservo.GetAge();
}
baofeng.user.Admin.prototype.disposeInternal = function(element){
	this.uservo = element;
	this.renderingview();
}
baofeng.user.Admin.prototype.enterDocument = function(){

}

