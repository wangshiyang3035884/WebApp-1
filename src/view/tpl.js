var fs = require("fs");
var ejs = require('ejs');
var config = require('../model/config');
function compile_tpl(name,data,bool){
  var tpl_c,tpl;
  tpl = fs.readFileSync(config.tplpath+name,"utf8");
  if(data){
  	data["filename"] = config.tplpath+name;
  }else{
  	data = {"filename":config.tplpath+name};
  }
  tpl_c = ejs.render(tpl,data);
  if(bool){
  	fs.writeFileSync(config.tplpathc+name,tpl_c);
  }
  return tpl_c;
}
function renderingtpl(name,data,bool){
	return compile_tpl(name,data,bool);
}
module.exports = {'rendertpl':renderingtpl};