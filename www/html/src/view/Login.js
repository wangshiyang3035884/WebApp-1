/**
 * 用户注册类 login
 * User: ningxiao
 * Date: 13-3-19
 * Time: 下午3:06
 */
baofeng.utils.provide("baofeng.user.Login");
baofeng.utils.require("baofeng.events.Event");
baofeng.utils.require("baofeng.ui.Component");
baofeng.user.Login = function (){
	this.LoginEvent = null;
	this.uservo = null;
}
baofeng.utils.inherits(baofeng.user.Login,baofeng.ui.Component);
baofeng.user.Login.TIMEOUT = 3000;
baofeng.user.Login.prototype.disposeInternal = function(uservo){
	this.uservo = uservo;
}
baofeng.user.Login.prototype.enterDocument = function(){
	this.LoginEvent = new baofeng.events.Event(baofeng.events.Event.COMPLETE);
	this.LoginEvent.data = this.uservo;
	console.log("获取登陆信息渲染UI界面");
	this.dispatchEvent(this.LoginEvent)
}

