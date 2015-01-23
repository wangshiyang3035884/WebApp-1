var fs = require("fs");
var url = require("url");
var zlib = require("zlib");
function httpOutput(file,request,response,mime,matched){
	var readstream,encoding,matched,data = url.parse(request.url,true);
	response.setHeader("Server","Nxiao/V5");
	readstream = fs.createReadStream(file,{"autoClose":true});
	encoding = request.headers['accept-encoding'] || "";
    if(matched && encoding.match(/gzip/)){
      response.writeHead(200,"Ok",{'Content-Encoding': 'gzip','Content-Type': mime+";charset=utf-8"});
      readstream.pipe(zlib.createGzip()).pipe(response); 
    }else if(matched && encoding.match(/deflate/)){
      response.writeHead(200, "Ok", {'Content-Encoding': 'deflate','Content-Type': mime+';charset=utf-8'});
      readstream.pipe(zlib.createDeflate()).pipe(response);  
    }else{
      response.writeHead(200,"Ok",{'Content-Type': mime});  
      readstream.pipe(response); 
    }   
}
module.exports = {'output':httpOutput};