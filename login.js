var database = require('./database');
var db = new database();

var express = require('express');
var app = express();
var session = require('client-sessions');
app.use(session({
	cookieName: 'session',
	secret: 'edwardallenpoe1234',
	duration: 30*60*1000,
	activeDuration: 5*60*1000,
}));

var mysql = require('mysql');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(express.static('.'));

app.listen(8080);

app.get('/', function (req, res){
	if(req.session.msg){
		res.write(req.session.msg);
		delete req.session.msg;
	}
	req.session.destroy();
	res.write("<html><body><form method=post action=\"/login\"><input type=\"text\" name=\"username\"><input type=\"password\" name=\"password\"><input type=\"submit\" value=\"Login\"></form></body></html>");
	res.end();
});

app.post('/login', function(req, res) {
	db.once('loggedin', function(msg) {
		if(msg==1) {
			req.session.username=req.body.username;
			return res.send('Successful login');
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
