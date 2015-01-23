/**
 * 用户登录类
 * Created by lijinpeng on 2014/10/21.
 */
baofeng.utils.provide("baofeng.user.Land");
baofeng.utils.require("baofeng.events.Event");
baofeng.utils.require("baofeng.model.UserVo");
baofeng.utils.require("baofeng.ui.Component");
baofeng.user.Land = function(){
    baofeng.ui.Component.apply(this,arguments);
    this.LandEvent = null;
};
baofeng.utils.inherits(baofeng.user.Land, baofeng.ui.Component);
baofeng.user.Land.TIMEOUT = 3000;
/**
 * 初始化
 */
baofeng.user.Land.prototype.init = function(){
	setTimeout(baofeng.utils.bind(this.landComplete,this),baofeng.user.Land.TIMEOUT);
};
baofeng.user.Land.prototype.landComplete = function(){
	console.log("请求服务器取得登陆信息");
	this.LandEvent.data = new baofeng.model.UserVo("宁肖",27);
	this.dispatchEvent(this.LandEvent)
}
/**
 * 初始化成员变量
 * @param element
 */
baofeng.user.Land.prototype.disposeInternal = function(element){
	this.init();
};

/**
 * 绑定事件
 */
baofeng.user.Land.prototype.enterDocument = function(){
	this.LandEvent = new baofeng.events.Event(baofeng.events.Event.COMPLETE);
};