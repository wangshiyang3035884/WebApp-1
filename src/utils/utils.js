/** 
 * 工具类
 * @type {exports} 
 */  
var utils = {
    istype:function(obj){
        return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];     
    }
};
module.exports =  utils;  

