
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mysql = require('./mysql_db')
  , ejs = require('ejs')
  , request = require('request');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// all environments
app.configure(function () {

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
app.use(express.cookieParser());
app.use(express.session({secret: "SW1990"}));
app.use(app.router);
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function (req, res) {
	if(req.session.firstname == undefined)
	{
		req.session.firstname = "";
	}
	if(req.session.userid == undefined)
	{
		req.session.userid = -1;
	}
	var msg = '';
	ejs.renderFile('views/login.ejs',{msg : msg, session: req.session},
			function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
	});		
});

app.get('/signup', function (req, res) {
	ejs.renderFile('views/signup.ejs',
			function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
	});		
});

app.get('/home', function (req, res) {
	/*if(req.session.content == undefined)
	{
	req.session.content = "";}*/
	//cache.put(userid, results);
	ejs.renderFile('views/home.ejs',{session : req.session},
			function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
	});		
});

app.get('/about', function (req, res) {
	if(req.session.overview == undefined)
	{
	req.session.overview = "";}
	if(req.session.work == undefined)
	{
	req.session.work = "";}
	if(req.session.education == undefined)
	{
	req.session.education = "";}
	if(req.session.contact == undefined)
	{
	req.session.contact = "";}
	if(req.session.events == undefined)
	{
	req.session.events = "";}
	ejs.renderFile('views/about.ejs',{session : req.session},
			function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
	});		
});

app.get('/interests', function (req, res) {
	if(req.session.music == undefined)
	{
	req.session.music = "";}
	if(req.session.videos == undefined)
	{
	req.session.videos = "";}
	if(req.session.movies == undefined)
	{
	req.session.movies = "";}
	if(req.session.shows == undefined)
	{
	req.session.shows = "";}
	if(req.session.sports == undefined)
	{
	req.session.sports = "";}
	ejs.renderFile('views/interests.ejs',{session : req.session},
			function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
	});		
});

app.get('/friends', function (req, res) {
	ejs.renderFile('views/friends.ejs',{session : req.session},
			function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
	});		
});

app.get('/groups', function (req, res) {
	ejs.renderFile('views/groups.ejs',{session : req.session},
			function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
	});		
});

app.post('/newuser', function (req, res) {
	/**if(!req.body.hasOwnProperty('firstname') ||!req.body.hasOwnProperty('lastname') 
			||!req.body.hasOwnProperty('email') ||!req.body.hasOwnProperty('password')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}**/
	
	mysql.insertUser(function(err,results){
		if(err){
			throw err;
			console.log(err);
		}else{
			req.session.firstname = req.param('firstname');
			req.session.userid = results.insertId;	
			console.log("Inserted");
			ejs.renderFile('views/home.ejs',{session : req.session},
					function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
	},req.param('firstname'),req.param('lastname'), req.param('email'), req.param('password'));

});

app.post('/signin', function (req, res) {
	/**if(!req.body.hasOwnProperty('email') ||!req.body.hasOwnProperty('password')) {
		res.statusCode = 400;
		return res.send('Error 400: Post syntax incorrect.');
	}**/
	
	mysql.validateUser(function(err,results){
		if(err){
			throw err;
		}else{
			if(results.length == 0)
			{
				var msg = "Incorrect credentials!!! Please try again.";
				ejs.renderFile('views/login.ejs',
						{msg : msg},
						function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			}
			else
			{
				req.session.firstname = results[0].firstname;
				req.session.userid = results[0].userid;	
				console.log("Validated");
				ejs.renderFile('views/home.ejs',{session : req.session},
						function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {
						res.end('An error occurred');
						console.log(err);
					}
				});
			
			}
		}
	},req.param('email'),req.param('password'));
	
});

/*app.post('/userPosts', function(req,res){
	req.session.content = "";
	mysql.insertPosts(function(err,results){
		if(err){
			throw err;
			console.log(err);
		}else{
			req.session.music = req.param('content');

			console.log("Inserted");
			ejs.renderFile('views/home.ejs',{session : req.session},
					function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
	},req.session.userid, req.param('content'));

});*/

app.post('/userDetails', function(req,res){
	mysql.insertAbout(function(err,results){
		if(err){
			throw err;
			console.log(err);
		}else{
			req.session.overview = req.param('overview');
			req.session.work = req.param('work');
			req.session.education = req.param('education');
			req.session.contact = req.param('contact');
			req.session.events = req.param('events');
			console.log("Inserted");
			ejs.renderFile('views/about.ejs',{session : req.session},
					function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
	},req.session.userid, req.param('overview'),req.param('work'), req.param('education'), req.param('contact'), req.param('events'));

});

app.post('/userInterests', function(req,res){
	req.session.music = "";
	req.session.videos = "";
	req.session.movies = "";
	req.session.shows = "";
	req.session.sports = "";
	mysql.insertInterests(function(err,results){
		if(err){
			throw err;
			console.log(err);
		}else{
			req.session.music = req.param('music');
			req.session.videos = req.param('videos');
			req.session.movies = req.param('movies');
			req.session.shows = req.param('shows');
			req.session.sports = req.param('sports');
			console.log("Inserted");
			ejs.renderFile('views/interests.ejs',{session : req.session},
					function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});
		}
	},req.session.userid, req.param('music'), req.param('videos'), req.param('movies'), req.param('shows'), req.param('sports'), req.param('events'));

});

app.get('/logout', function (req, res) {
	req.session.name = "";
	req.session.userid = -1;
	var msg = "";
	ejs.renderFile('views/login.ejs',{msg: msg,session : req.session},
			function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
