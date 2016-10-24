/**
 * Created by Ekaruztech on 7/18/2016.
 */
var _ = require('underscore');
var mongoSanitize = require('mongo-sanitize');
var htmlSanitize = require('sanitize-html');

module.exports = function(req, res, next) {
    "use strict";
    if(req.body && !_.isEmpty(req.body))
    {
        console.info("Sanitizing req.body!");
        var body = req.body;
        for(let prop in body)
        {
            if(body.hasOwnProperty(prop))
            {
                htmlSanitize(body[prop]);
                mongoSanitize(body[prop]);
            }
        }
    }

    if(req.query && !_.isEmpty(req.query))
    {
        console.info("Sanitizing req.query!");
        var query = req.query;
        for(let prop in query)
        {
            if(query.hasOwnProperty(prop))
            {
                htmlSanitize(query[prop]);
                mongoSanitize(query[prop]);
            }
        }
    }

    if(req.params && !_.isEmpty(req.params))
    {
        console.info("Sanitizing req.params!");
        var params = req.params;
        for(let prop in params)
        {
            if(params.hasOwnProperty(prop))
            {
                htmlSanitize(params[prop]);
                mongoSanitize(params[prop]);
            }
        }
    }

    next();
};