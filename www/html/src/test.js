/**
 * baofeng.index
 * Created by lijinpeng on 2014/10/21.
 */
baofeng.utils.provide("baofeng.test");
baofeng.utils.require("baofeng.user.Land");
baofeng.utils.require("baofeng.user.Login");
baofeng.utils.require("baofeng.user.Admin");
baofeng.utils.require("baofeng.events.Event");
baofeng.utils.require("baofeng.ui.Component");
baofeng.utils.require("baofeng.model.UserVo");
baofeng.utils.require("baofeng.model.constant");	
function logincall(event){
	var admin,uservo = event && event.data;
	if(uservo && uservo instanceof baofeng.model.UserVo){
		 admin = new baofeng.user.Admin();
		 admin.decorate(uservo);
	}
}
baofeng.test = function(){
	var land,login;
    land = new baofeng.user.Land();
    login = new baofeng.user.Login();
    land.addEventListener(baofeng.events.Event.COMPLETE,function(event){
    	login.addEventListener(baofeng.events.Event.COMPLETE,logincall);
    	login.decorate(event.data);
    });
    land.decorate();
};
baofeng.test();
