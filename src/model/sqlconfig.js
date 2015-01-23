exports.insert_user = 'INSERT INTO user (name, password) VALUES (?,?)';
exports.landed_user = 'SELECT * FROM user where name = ? AND password = ?';
exports.select_user = 'SELECT * FROM user where uid = ?';
 