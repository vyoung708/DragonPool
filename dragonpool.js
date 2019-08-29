
var express = require('express');
var request = require('request');
<<<<<<< HEAD

var app = express();
var mysql = require('mysql');

app.use(express.static('.'));

=======
var cors = require('cors');
//creating express variable and setting up the 8080 port
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());
app.listen(8080);
//header to allow for CORS (had to implement this in order for POST to work)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//requiring mysql and establishing connection
var mysql = require('mysql');
>>>>>>> parent of 16f9b8a... Uploading new dragonpool.js
var con = mysql.createConnection({
	//Lets you search through multiple tables in one query
	multipleStatements: true,
	host: 'localhost',
	//Needs replace
	user: '<USERNAME>',
	password: '<PASSWORD>',
	database: '<DATABASE>'
});
<<<<<<< HEAD
con.connect(function(err){
	if(err){
		console.log("Error connecting to database");
		console.log(err);
	}
	else{
		console.log("Database successfully connected");
	}
});

//Will redirect to the main html page
app.get("/",function(req,res){
	res.redirect('/PROJECTMain.html');
	con.query('SELECT * from course',
		function(err,rows,fields){
			if(err)
				console.log('Error during query processing');
			else
				console.log('Here is the result: ', rows);
		});
})

//Loads all of the posts
app.get("/posts",function(req,res){
	con.query('SELECT * FROM <POST TABLE>',
		function(err,rows,fields){
			if(err)
				console.log('Error during query');
			else{

				}
			res.send(str);	
			}
		});
})

//Filter posts by city/state
app.get("/filter",function(req,res){
	//var query = req.query.<CITY/STATE>;
	con.query('SELECT UNIQUE(query) FROM <POST_TABLE>',
		function(err,rows,fields){
			if(err)
				console.log(err);
			else{
				console.log("success");
			}
	});
})

//Adds an account to the database
app.get("/addaccount",function(req,res){
	//Account information that has been recieved by the webpage
	//Changes these if necessary
	var userQuery = req.query.USERNAME;
	var passQuery = req.query.PASSWORD;
	var emailQuery = req.query.EMAIL;
	var firstQuery = req.query.FIRSTNAME;
	var lastQuery = req.query.LASTNAME;
	var phoneQuery = req.query.PHONE;
	var found = 0;
	con.query('SELECT * FROM accounts',
		function(err,rows,fields){
			if(err)
				console.log(err);
			else{
				//checks if username or email already exists inside of the database
				for(var i = 0; i < rows.length; i++){
					if(rows[i].USERNAME == userQuery && rows[i].EMAIL == emailQuery){
						found = 1;
					}
				}
				if(found == 0){
					//ADD INFO TO DATABASE
				}
				else{
					//RETURN ERROR BACK TO HTML
				}
			}
		});
})

//Add a post
//maybe use app.post?
app.get("/addpost",function(req,res){
	
})

//Edit account information from the database
app.get("/edit",function(req,res){
	
})

//Removes a post
//maybe use app.post?
app.get("/deletepost",function(req,res){
	
})

//Edits a post only if it was created by the user
app.get("/editpost",function(req,res){
	
})

//Loads account information
//maybe use app.post?
app.get("/loadaccount",function(req,res){
	
})

app.listen(8080, function(){
	console.log('Server Started...');
})
=======
con.connect(function(err) {
if (err) {
console.log(err);
}
else {
console.log('Database successfully connected');
}
});
app.use(express.static("."));

//this works
app.get('/posts', function(req,res){
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

app.post('/addpost', function(req,res){
  //create variables for the input fields
  //need to make a query that gets theh account_id first - just hardcode it in for now
  con.query("INSERT INTO POSTS (account_id, from_loc, to_loc, type, date, description, num_riders) VALUES (" + account_id + ", '" + from_loc + "', '" + to_loc + "', '" + type + "', '" + date + "', '" + description + "', " + num_riders + ");",
  function(err,rows,fields)
  {
  if (err)
  {
    console.log(err);
  }
  else
  {
    console.log("Success");
  }
  res.send("Success");
});
});
>>>>>>> parent of 16f9b8a... Uploading new dragonpool.js
