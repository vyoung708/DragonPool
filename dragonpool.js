/*Variables with <> or all caps should be replaced when
* HTML and mySQL variables are known
*/
var express = require('express');
var request = require('request');

var app = express();
var mysql = require('mysql');

app.use(express.static('.'));

var con = mysql.createConnection({
	//Lets you search through multiple tables in one query
	multipleStatements: true,
	host: 'localhost',
	//Needs replace
	user: '<USERNAME>',
	password: '<PASSWORD>',
	database: '<DATABASE>'
});
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