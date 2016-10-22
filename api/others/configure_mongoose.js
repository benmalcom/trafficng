/**
 * Created by Richard on 9/8/2016.
 */
var mongoose = require('mongoose');
var config = require('config');

module.exports = function () {
    // Use q. Note that you **must** use `require('q').Promise`.
    mongoose.Promise = require('q').Promise;

    mongoose.connection.on("open", function() {
        console.log("Connected to mongo server.");
    });

    mongoose.connection.on("error", function(err) {
        console.log("Could not connect to mongodb!");
        console.log(err);
    });
    console.log("mongo url ",config.get('db.url'));
    mongoose.connect(config.get('db.url'));
};
