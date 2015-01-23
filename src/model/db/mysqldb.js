var mysql = require('mysql');
var pool  = mysql.createPool({
  host     : '192.168.202.204',
  user     : 'root',
  password : '19870615',
  database : 'webapp',
  port: '3306'
});
function getConnection(sql,json,callback){
  pool.getConnection(function(err, conn) {
    if(!err){
      conn.query(sql,json, function(err, results){
        conn.release();
        callback(err, results);
      });   
    }else{
      callback(err, null);
    }
  }); 
}
exports.pool = getConnection;
