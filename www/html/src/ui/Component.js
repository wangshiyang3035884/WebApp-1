/**
 * baofeng.ui.Component UI组件基类
 * User: ningxiao
 * Date: 14-10-15
 * Time: 下午3:06
 */
baofeng.utils.provide("baofeng.ui.Component");
baofeng.utils.require("baofeng.events.EventDispatcher");
baofeng.ui.Component = function () {
    baofeng.events.EventDispatcher.apply(this, arguments);
}
baofeng.utils.inherits(baofeng.ui.Component,baofeng.events.EventDispatcher);
baofeng.ui.Component.prototype.log = function(news){
}
baofeng.ui.Component.prototype.decorate = function(element){
	this.disposeInternal(element);
	this.enterDocument();
}
baofeng.ui.Component.prototype.release = function(){
	this.decorateInternal();
}
baofeng.ui.Component.prototype.disposeInternal = function(element){	
}
baofeng.ui.Component.prototype.enterDocument = function(){
}
baofeng.ui.Component.prototype.decorateInternal = function(){	
}

