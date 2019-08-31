/*Variables with <> or all caps should be replaced when
* HTML and mySQL variables are known
*/
var express = require('express');
var request = require('request');
var cors = require('cors');
var app = express();
var mysql = require('mysql');
app.use(cors());
app.use(express.static('.'));
var mysql = require('mysql');
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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Will redirect to the main html page
app.get("/",function(req,res){
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

});

//Edits a post only if it was created by the user
app.get("/editpost",function(req,res){

});

//Loads account information
//maybe use app.post?
app.get("/loadaccount",function(req,res){

});

app.listen(8080, function(){
	console.log('Server Started...');
});
