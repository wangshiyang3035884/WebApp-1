baofeng.utils.provide("baofeng.model.constant");
baofeng.model.constant.cuid = 'cuid';	
baofeng.model.constant.namemax = 20;
baofeng.model.constant.phonemax = 11;
baofeng.model.constant.emailmax = 80;
baofeng.model.constant.qqmax = 80;
baofeng.model.constant.captchamax = 4;
baofeng.model.constant.websitemax = 32;
baofeng.model.constant.passwordmax = 16;	
baofeng.model.constant.videosize = 4*1024*1024;
baofeng.model.constant.servicetype = 1;	//1是一站式saas，0是开放式paas
baofeng.model.constant.liveurl = "http://cloud.baofeng.com/user/activeUser";	
baofeng.model.constant.playurl="http://cloud.baofeng.com/swf/cloud.swf";
baofeng.model.constant.htmlurl="http://cloud.baofeng.com/help/bcloud.html";
baofeng.model.constant.paasurl = "http://query.bfcloud.com/";
baofeng.model.constant.uploadname="swfupload";
baofeng.model.constant.videotypes = "wmv|avi|dat|asf|rm|rmvb|ram|mpg|mpeg|3gp|mov|mp4|m4v|dvix|dv|dat|mkv|flv|f4v|vob|ram|qt|divx|cpk|fli|flc|mod|ts".toUpperCase();
/**
 * 异常码对应表
 * 111    用户取消上传
 * 112    用户上传失败
 * 113    上传验证异常
 * 114    服务端返回数据异常
 * 115    服务端返回状态码异常
 * 116    选择上传文件格式不支持
 * 404    服务端请求异常
 */
 