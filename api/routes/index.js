/**
 * Created by Malcom on 7/19/2016.
 */
var config = require('config');
var prefix = config.get('api.prefix');
var formatResponse = require('../shared/format-response');

module.exports = function (app) {
    app.use(prefix,require('./traffic-level'));
    app.use(prefix,require('./traffic'));
    app.use(prefix,require('./state'));


    app.use(config.get('api.prefix')+"/*",function (req,res) {
        var meta = {success:false,statusCode:404,message:"We don't seem to understand your request!"};
        meta.error = {code:meta.statusCode,message:"Resource not found"};
        res.status(meta.statusCode).json(formatResponse.do(meta));
    });
};