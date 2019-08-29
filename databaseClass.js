'use strict'

var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');

var dbinfo = {'multipleStatements: true,
	host: 'localhost',
	user: '<USERNAME>',
	password: '<PASSWORD>',
	database: '<DATABASE>'};

var con = mysql.createConnection(dbinfo);
con.connect(function(err) {
	if (err) {
		console.log('Error connecting to database');
	} else {
		console.log('Database successfully connected');
	}
});

class Database extends EventEmitter {
	constructor(){super();}
	login(username, password) {
		var str = "SELECT type FROM accounts WHERE username=" + con.escape(username) + " AND password=PASSWORD(" + con.escape(password) + ")";
		var self = this;
		con.query(str,
			function(err, rows, fields) {
				if(err) {
					console.log('Error');
					return 0;
				} else {
					if(rows.length>0)
						self.emit('loggedin',1);
					else
						self.emit('loggedin',0);
				}
			}
		);
	}
}
exports.Database = Database