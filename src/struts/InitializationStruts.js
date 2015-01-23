var fs =require("fs");  
var xpath = require('xpath.js');
var logger = require('../utils/logger');
var xmldom = require('xmldom').DOMParser;
var strutsxml;    
function resolvexml(path){
	var configs,nodes,json,action,node,xml,namespace,pointcut;
	if(path){
		json = {};
		xml = fs.readFileSync(path,"utf-8").replace(/[\r\n\t]/g,"");
		strutsxml = new xmldom().parseFromString(xml); 
		nodes = xpath(strutsxml, "//aop")[0].childNodes;
		for(var i=0,l=nodes.length;i<l;i++){
			node = nodes[i];
			namespace = node.getAttribute("id");
			json[namespace] = action = {};
			action['method'] = node.getAttribute("method");
			action['joinpoint'] = node.getAttribute("joinpoint");
			action['advice'] = node.getAttribute("advice") || "before";
			action['class'] = node.getAttribute("class").replace(/\./g,'/');
		}		
		configs = [json];
		json = {}; 
		nodes = xpath(strutsxml, "//action");
		for(i=0,l=nodes.length;i<l;i++){
			node = nodes[i];
			namespace = (node.getAttribute("namespace") || "/") + node.getAttribute("name");
			json[namespace] = action = {};
			action['class'] = node.getAttribute("class").replace(/\./g,'/');
			action['method'] = node.getAttribute("method");
			pointcut = node.getAttribute("pointcut");
			if(pointcut){
				action['pointcut'] = pointcut;
			}
			action['result'] = resolveresult(node.childNodes);
		}
		configs.push(json);
	}
	return configs; 
}
function resolveresult(nodes){
	var nodes,node,action,json = {};
	for(var i=0,l=nodes.length;i<l;i++){
		node = nodes[i];
		json[(node.getAttribute("name") || 'success')] = action = {};
		action['type'] = node.getAttribute("type");
		action['param'] = node.getAttribute("param") || "results";
		action['value'] = node.toString().replace(/<[^>].*?>/g,'');
	}
	return json;
}
module.exports = {'InitStruts':resolvexml};
