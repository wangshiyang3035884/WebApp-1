baofeng.utils.provide("baofeng.model.UserVo");
baofeng.model.UserVo = function(name,age){
	this.name = name;
	this.age = age;
}
baofeng.model.UserVo.prototype.GetName = function(){
	return this.name;
}
baofeng.model.UserVo.prototype.SetName = function(name){
	this.name = name;
}
baofeng.model.UserVo.prototype.GetAge = function(){
	return this.age;
}
baofeng.model.UserVo.prototype.SetAge = function(age){
	this.age = age;
}