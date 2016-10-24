/**
 * Created by Malcom on 9/9/2016.
 */
var config = require('config');
var mongoose = require('mongoose');

exports.defaults = function () {

    process.env.API_VERSION = config.get('api.versions').pop();
    global.__base = __dirname + '/';
};

exports.mongoose = function () {
    // Use q. Note that you **must** use `require('q').Promise`.
    mongoose.Promise = require('q').Promise;

    mongoose.connection.on("open", function() {
        console.log("Connected to mongodb server.");
    });

    mongoose.connection.on("error", function(err) {
        console.log("Could not connect to mongodb!");
        console.log(err);
    });
    console.log("mongo url ",config.get('db.mongodb.url'));
    mongoose.connect(config.get('db.mongodb.url'));
};