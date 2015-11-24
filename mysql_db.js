/**
 * New node file
 */

var mysql = require('mysql');
var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'test',
  port: '3306',
  database: 'facebook'
});

function insertUser(callback,firstname,lastname,email,password){
	var sql = "INSERT INTO user (firstname, lastname, email, password) VALUES('" + firstname + "','" + lastname + "','" + email + "','"+ password + "')";
	console.log(sql);
	pool.getConnection(function(err, connection){
		connection.query(sql, function(err, results) {
			if (err) {
	           throw err;
	        }
			else
			{
				callback(err, results);
			}
			console.log(results);
		});
		connection.release();
	});	
}

function validateUser(callback,email,password){
	console.log("Email: " + email + "Password: " + password);
	var sql = "SELECT * FROM user where email = '" + email + "'" + "and password = '" + password + "'";
	pool.getConnection(function(err, connection){
		  connection.query( sql,  function(err, rows){
		  	if(err)	{
		  		throw err;
		  	}else{		  		
					console.log("DATA : "+JSON.stringify(rows));
					callback(err, rows);		  		
		  	}
		  });		  
		  connection.release();
		});	
}

function insertAbout(callback, userid, overview, work, education, contact, events){
	var sql = "INSERT INTO userdetails (userid, overview, work, education, contact, events) VALUES("+ userid +", '"+ overview +"', '" + work + "', '" + education + "', '" + contact + "', '" + events + "')";
	console.log(sql);
	pool.getConnection(function(err, connection){
		connection.query(sql, function(err, results) {
			if (err) {
	           throw err;
	        }
			else
			{
				callback(err, results);
			}
			console.log(results);
		});
		connection.release();
	});	
}

function insertInterests(callback, userid, music, videos, movies,  shows, sports){
	var sql = "INSERT INTO userinterests (userid, music, videos, movies,  shows, sports) VALUES("+ userid +", '" + movies + "', '"+ music + "', '" + videos + "', '"+ shows + "', '" + sports + "')";
	console.log(sql);
	pool.getConnection(function(err, connection){
		connection.query(sql, function(err, results) {
			if (err) {
	           throw err;
	        }
			else
			{
				callback(err, results);
			}
			console.log(results);
		});
		connection.release();
	});	
}

/*function insertPosts(callback, postid, content, userid){
	var sql = "INSERT INTO userinterests (postid, content, userid) VALUES( '" + content + "','"+ userid +"')";
	console.log(sql);
	pool.getConnection(function(err, connection){
		connection.query(sql, function(err, results) {
			if (err) {
	           throw err;
	        }
			else
			{
				callback(err, results);
			}
			console.log(results);
		});
		connection.release();
	});	
}*/

exports.insertUser = insertUser;
exports.validateUser = validateUser;
exports.insertAbout = insertAbout;
exports.insertInterests = insertInterests;
/*exports.inserPosts = insertPosts;*/
