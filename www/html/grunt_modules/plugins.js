var fs = require('fs'); 
function scanFolder(path){
  var walk,fileList = [],folderList = [];
    walk = function(path, fileList, folderList){
        files = fs.readdirSync(path);
        files.forEach(function(item) {  
            var tmpPath = path + '/' + item,stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {  
                walk(tmpPath, fileList, folderList); 
                folderList.push(tmpPath); 
            } else {
                if(tmpPath.indexOf(".js",tmpPath.length-3)){
                  fileList.push(tmpPath); 
                }
            }  
        });  
    };  
  walk(path, fileList, folderList);
  console.log('扫描' + path +'成功');
  return {'files': fileList,'folders': folderList};
}
function readsFile(path,fun){
  var data=fs.readFileSync(path,"utf-8"); 
  if(fun){
    return fun(path,data);
  }   
  return data;
}
function analysis(path,data){
  var provide,json,requires=[];
  data.replace(/provide\("(.*?)"\)/ig, function() {
    provide = arguments[1] || "";
  }); 
  data.replace(/require\("(.*?)"\)/ig, function() {
    requires.push(arguments[1]);
  }); 
  if(provide){
    json={};
    json.key = provide;
    json.value = [path,requires];
  } 
  return json;
}
function depsmain(relys,deps){
  var data,path,provide,require,files,json= {},lists={};
  for(var i=0,l=relys.length,arr;i<l;i++){
    arr = scanFolder(relys[i]);
    if(data){
      data.files = data.files.concat(arr.files);
      data.folders = data.folders.concat(arr.folders);
    }else{
      data = arr;
    }
  }
  files = data.files;
  for(var i=0,len=files.length;i<len;i++){
    path = files[i];
    data = readsFile(path,analysis);
    if(data){
      lists[data.key] = data.value;   
    } 
  }
  fs.writeFileSync(deps+'/deps.js', JSON.stringify(lists),"utf8");
  console.log('写入deps文件完成');
}
function inituglify(key,deps){
  var walk,unique,static_list = [],data=JSON.parse(fs.readFileSync(deps+'/deps.js',"utf-8"));
  if(!(key in data)){
    console.log("不存在的命名空间");
    return static_list;
  }
  unique = function(arr){
      var n = {},r=[]; //n为hash表，r为临时数组
      for(var i = 0; i < arr.length; i++){//遍历当前数组
          if (!n[arr[i]]){ //如果hash表中没有当前项
              n[arr[i]] = true; //存入hash表
              r.push(arr[i]); //把当前数组的当前项push到临时数组里面
          }
      }
      r.unshift(deps+"/utils/utils.js")
      return r;
  };   
    walk = function(key){ 
      var src,list,obj = data[key];
      if(obj){
        src =  obj[0];
        list = obj[1];
        if(list.length !=0){
          list.forEach(function(item) {
             walk(item);
          });
        }
        static_list.push(src);        
      }
    };  
  walk(key);
  return unique(static_list);
}

function format (fmt) {
  var date = new Date();
  var o = {
      "M+": date.getMonth() + 1, //月份 
      "d+": date.getDate(), //日 
      "h+": date.getHours(), //小时 
      "m+": date.getMinutes(), //分 
      "s+": date.getSeconds(), //秒 
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
      "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function writemin(path){
  var data = fs.readFileSync(path,"utf-8"); 
  data = data.replace(/baofeng.utils.require\("(.*?)"\)\,/ig,"");
  fs.writeFileSync(path,data,"utf8"); 
}
function upcache(list,path,ver){
  var data,str,caches="CACHE MANIFEST\n#update "+format('yyyy-MM-dd hh:mm:ss') +" V"+ver +"\nCACHE:\n";
  for(var i=0,l=list.length;i<l;i++){
    data = readsFile(list[i]);
    data.replace(/\<(.*?)\>/ig, function() {
      str = arguments[1];
      if(str.indexOf('data-cache')!=-1){
        str.replace(/href="(.*?)"/ig, function() {
          caches+=arguments[1]+"\n";
        }); 
        str.replace(/src="(.*?)"/ig, function() {
          caches+=arguments[1]+"\n";
        });         
      }
    });     
  }
  fs.writeFileSync(path,caches,"utf8");  
}
module.exports = {'upcache':upcache,'deps':depsmain,'init':inituglify,min:writemin};