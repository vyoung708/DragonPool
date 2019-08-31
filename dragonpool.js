/*Variables with <> or all caps should be replaced when
* HTML and mySQL variables are known
*/
var express = require('express');
var request = require('request');
var cors = require('cors');
var app = express();
var mysql = require('mysql');
var database = require('./database');
var bodyParser = require("body-parser");

var db = new database();
app.use(cors());
app.use(express.static('.'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

var con = mysql.createConnection({
host: 'localhost',
port: '3306',
user: 'root',
password: 'password',
database: 'school'
});
con.connect(function(err) {
if (err) {
console.log(err);
}
else {
console.log('Database successfully connected');
}
});

app.use(session({
	cookieName: 'session',
	secret: 'edwardallenpoe1234',
	duration: 30*60*1000,
	activeDuration: 5*60*1000,
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res){
	if(req.session.msg){
		res.write(req.session.msg);
		delete req.session.msg;
	}
	req.session.destroy();
	res.write("<html><body><form method=post action=\"/login\"><input type=\"text\" name=\"username\"><br><input type=\"password\" name=\"password\"><br><input type=\"submit\" value=\"Login\"></form></body></html>");
	res.end();
});

//Will redirect to the main html page
app.get("/home",function(req,res){
	res.redirect('/PROJECTMain.html');
});

//Loads all of the posts
app.get("/posts",function(req,res){
  var posts_str = "<ul>";
  con.query("select POSTS.account_id, from_loc, to_loc, type, date, description, num_riders, ACCOUNT.id, first_name, last_name, email from POSTS, ACCOUNT where POSTS.account_id = ACCOUNT.id;",
  function(err,rows,fields)
  {
  if (err)
  {
    console.log('Error during query processing');
  }
  else
  {
    for (var i=0;i<rows.length;i++)
    {
      date = rows[i].date;
      posts_str += "<li><b>" + rows[i].type + " Passengers in " + rows[i].from_loc + " to " + rows[i].to_loc + "</b><br>User: " + rows[i].first_name + " " + rows[i].last_name + "<br>Description: " + rows[i].description + "<br>Date: " + date + "</li>";
    }
    posts_str += "</ul";
  }
  res.send(posts_str);
});
});

//Get list of distinct 'from cities' - this can be used to generate a dropdown of cities for the filter
app.get("/citylist", function(req,res){
  citylist = [];
  con.query("SELECT DISTINCT(from_loc) from POSTS;",
  function(err,rows,fields)
  {
  if (err)
  {
    res.send("Error");
  }
  else
  {
    for (var i=0;i<rows.length;i++)
    {
      citylist.push(rows[i]);
    }
    res.send(citylist);
  }
});
});

//Filter posts by city/state
app.get("/filter",function(req,res){
	var from = req.query.from;
  var posts_str = "<ul>";
  con.query("select POSTS.account_id, from_loc, to_loc, type, date, description, num_riders, ACCOUNT.id, first_name, last_name, email from POSTS, ACCOUNT where POSTS.account_id = ACCOUNT.id & POSTS.from_loc = '" + from + "';",
  function(err,rows,fields)
  {
  if (err)
  {
    console.log('Error during query processing');
  }
  else
  {
    for (var i=0;i<rows.length;i++)
    {
      date = rows[i].date;
      posts_str += "<li><b>" + rows[i].type + " Passengers in " + rows[i].from_loc + " to " + rows[i].to_loc + "</b><br>User: " + rows[i].first_name + " " + rows[i].last_name + "<br>Description: " + rows[i].description + "<br>Date: " + date + "</li>";
    }
    posts_str += "</ul";
  }
  res.send(posts_str);
});
});

//Adds an account to the database if username/email is currently not being used
app.get("/addaccount",function(req,res){
	//Account information that has been recieved by the webpage
	//Changes these variables if necessary
	var userQuery = req.query.USERNAME;
	var passQuery = req.query.PASSWORD;
	var emailQuery = req.query.EMAIL;
	var firstQuery = req.query.FIRSTNAME;
	var lastQuery = req.query.LASTNAME;
	var phoneQuery = req.query.PHONE;
	var found = 0;
	con.query('SELECT * FROM ACCOUNT',
		function(err,rows,fields){
			if(err)
				console.log(err);
			else{
				//checks if username or email already exists inside of the database
				var i = 0;
				while(i < row.length || found == 0){
					if(rows[i].username == userQuery || rows[i].email == emailQuery)
						found = 1;
					i++;
				}
				if(found == 0){
					con.query('INSERT INTO ACCOUNT ("username","password","email","phone","first_name","last_name") VALUES ('+userQuery+','+passQuery+','+emailQuery+','+phoneQuery+','+firstQuery+','+lastQuery+')',
						function(err,rows,fields){
							if(err)
								console.log('Error Adding Account');
							else{
								console.log('Account created');
							}
						});
				}
				else if(found == 1)
					res.send('Username/Email currently in use');
			}
		});
})

//Add a post
//Added code that pulls the ID from the database based on the username (passed in through query) - may not be necessary later on
app.post("/addpost",function(req,res){
  username = req.query.user;
  id = 0;
  con.query("SELECT id from ACCOUNT where ACCOUNT.username = '" + username + "';",
  function(err,rows,fields)
  {
  if (err)
  {
    res.send("Error");
  }
  else if (rows.length > 0)
  {
    id = rows[0];
    con.query("INSERT INTO POSTS (account_id, from_loc, to_loc, type, date, description, num_riders) VALUES (" + id + ", '" + from_loc + "', '" + to_loc + "', '" + type + "', '" + date + "', '" + description + "', " + num_riders + ");",
    function(err,rows,fields)
    {
    if (err)
    {
      res.send("Error");
    }
    else
    {
      res.send("Success");
    }
    });
  }
  else
  {
    res.send("No account found for this user");
  }
  });
  });


//Edit account information from the database
app.get("/edit",function(req,res){
	//Account information that has been recieved by the webpage
	//Changes these variables if necessary
	var userQuery = req.query.USERNAME;
	var passQuery = req.query.PASSWORD;
	var emailQuery = req.query.EMAIL;
	var firstQuery = req.query.FIRSTNAME;
	var lastQuery = req.query.LASTNAME;
	var phoneQuery = req.query.PHONE;
	var found = 0;
	con.query("UPDATE ACCOUNT SET password='"+passQuery+"', email='"+emailQuery+"', first_name='"+firstQuery+"',last_name='"+lastQuery+"',phone='"+passQuery+"' WHERE username='"+userQuery+"'",
		function(err,rows,fields){
			if(err)
				console.log(err);
		});
})

//Removes a post
//maybe use app.post?
app.get("/deletepost",function(req,res){
	var quer = "DELETE FROM posts WHERE post_id =" + req.query.postid + " AND account_id =" + req.session.userid;
	con.query(quer, function(err, result) {
		if(err){
			console.log(err);
		} else {
			console.log(result.affectedRows);
		}
	});
});

//Edits a post only if it was created by the user
app.get("/editpost",function(req,res){
	var quer = "SELECT account_id FROM posts WHERE post_id=" + req.query.postid;
	var account = "";
	con.query(quer, function(err, rows, fields) {
		if(err){
			console.log(err);
		} else {
			account = rows[0].account_id;
		}
	});
	if(account == req.session.userid){
		var quer = "UPDATE posts SET ";
		var count = 0;
		for (var param in req.query){
			if(param != "account_id" and count != 0){
				quer += " AND " + param + "=" + con.escape(req.query[param]);
			} else if (param != "account_id") {
				quer += param + "=" + con.escape(req.query[param]);
			}
		}
	}
});

//Loads account information
//maybe use app.post?
app.get("/loadaccount",function(req,res){
	var quer = "SELECT * FROM accounts WHERE id=" + req.session.userid;
	var listStr = "<ul>";
	con.connect(quer, function(err, rows, fields) {
		if(err){
			console.log(err);
		} else {
			for (var i = 0; i < rows.length; i++){
				listStr += "<li>Username: " + rows[i].username + "</li>";
				listStr += "<li>First Name: " + rows[i].first_name + "</li>";
				listStr += "<li>Last Name: " + rows[i].last_name + "</li>";
				listStr += "<li>Email: " + rows[i].email + "</li>";
				listStr += "<li>Phone No.: " + rows[i].phone + "</li>";
			}
		}
	});
	listStr += "</ul>";
	quer = "SELECT * FROM posts WHERE account_id=" + req.session.userid;
	listStr += "<br>Posts:<br><ul>";
	con.connect(quer, function(err, rows, fields) {
		if(err){
			console.log(err);
		} else {
			for (var i = 0; i < rows.length; i++){
				listStr += "<li>Post ID: " + rows[i].post_id + "</li>";
				listStr += "<li>From: " + rows[i].from_loc + "</li>";
				listStr += "<li>To: " + rows[i].to_loc + "</li>";
				listStr += "<li>Type: " + rows[i].type + "</li>";
				listStr += "<li>Date: " + rows[i].date + "</li>";
				listStr += "<li>Desc: " + rows[i].description + "</li>";
				listStr += "<li>Riders: " + rows[i].num_riders + "</li>";
			}
		}
	});
	listStr += "</ul>";
});

app.post('/login', function(req, res) {
	db.once('loggedin', function(msg) {
		if(msg==1) {
			var quer = "SELECT id FROM accounts WHERE username =" + con.escape(req.body.username);
			con.query(quer, function(err, rows, fields) {
				if(err){
					console.log(err);
				} else {
					req.session.userid=rows[0].id;
				}
			});
			return res.redirect('/home');
		} else {
			req.session.msg = "Invalid login";
			return res.redirect('/');
		}
	});
	db.login(req.body.username, req.body.password);
});

app.get('/logout', function(req, res) {
	req.session.reset();
	req.session.msg = 'You logged out';
	return res.redirect('/');
});

app.listen(8080, function(){
	console.log('Server Started...');
});
