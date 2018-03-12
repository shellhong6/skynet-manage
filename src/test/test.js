var mongoose = require('mongoose');
//
// // Connection URL
var url = 'mongodb://127.0.0.1:27017';
// // Use connect method to connect to the Server
//
//
/* Connect to the DB */
mongoose.connect(url,function(){
    /* Drop the DB */
    // mongoose.connection.db.dropDatabase();
    // console.log('in-------------connect-------------');
    // console.log(mongoose.connection.db.executeDbCommand);
    // console.log(mongoose.connection.db.executeDbCommand({'listDatabases':1}));
});

var url = 'mongodb://172.16.118.12:27017/manage-user';
var mongoose = require('mongoose')
    , Admin = mongoose.mongo.Admin;

/// create a connection to the DB
var connection = mongoose.createConnection(url);
connection.on('open', function() {
    // connection established
    new Admin(connection.db).listDatabases(function(err, result) {
        console.log('listDatabases succeeded');
        // database list stored in result.databases
        var allDatabases = result.databases;
        console.log('allDatabases', allDatabases);
    });
});
