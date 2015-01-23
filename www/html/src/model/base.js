/**
 * @class: base 暴风云视频配置类
 * @author: ningxiao
 * @version: 1.1
 * @namespace: baofeng.base
 */
baofeng.utils.provide("baofeng.model.base");
baofeng.model.base.isLogin = false;
baofeng.model.base.onActionlist = {};
baofeng.model.base.CAPTCHA = "http://cloud.baofeng.com/util/getCaptcha";
baofeng.model.base.onActionTojs = function(){
	var arg = Array.prototype.slice.call(arguments);
	var type = arg.shift(),data = true,obj;
	if(type in baofeng.model.base.onActionlist){
        obj = baofeng.model.base.onActionlist[type];
        if(baofeng.utils.getType(obj) == "Array"){
            return obj[1].apply(obj[0],arg);
        }else{
            return obj.apply(this,arg);
        }
	}
	return data;	            	
}