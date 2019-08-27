
var express = require('express');
var request = require('request');
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
