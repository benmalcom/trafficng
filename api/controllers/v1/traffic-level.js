/**
 * Created by Malcom on 8/30/2016.
 */

var TrafficLevel = require('../../models/traffic-level');
var formatResponse = require('../../shared/format-response');
var Validator = require('validatorjs');
var _ = require('underscore');
var helper = require('../../../utils/helper');
var config = require('config');

module.exports = {
    trafficLevelIdParam: function (req,res,next,traffic_level_id) {
        TrafficLevel.findById(traffic_level_id, function (err, trafficLevel) {
            if (err) {
                console.error("traffic_level_id params error ",err);
                return next(err);
            }
            else {
                req.trafficLevel = trafficLevel;
                next();
            }
        });
    },

    create: function(req, res,next){
        var meta = {statusCode:200, success:false},
            error = {};
            var obj = req.body;
            var rules = {name:'required'};
            var validator = new Validator(obj,rules,{'required.name':"The name of the traffic level is required"});
            if(validator.passes())
            {
                var trafficLevel = new TrafficLevel(obj);
                trafficLevel.save(function (err,savedTrafficLevel) {
                    if(err)
                    {
                        error =  helper.transformToError({code:503,message:"Sorry this traffic level could not be saved at this time, try again!"}).toCustom();
                        return next(error);
                    }
                    else
                    {
                        meta.success = true;
                        meta.message = "New traffic level created!";
                        res.status(meta.statusCode).json(formatResponse.do(meta,savedTrafficLevel));
                    }
                });

            }
            else
            {
                error =  helper.transformToError({
                    code:422,
                    message:"There are some errors with your input",
                    messages:helper.validationErrorsToArray(validator.errors.all())}).toCustom();
                return next(error);
            }
    },
    findOne: function (req, res,next) {
        var meta = {statusCode:200, success:false},
            trafficLevel = req.trafficLevel,
            error = {};
        if(trafficLevel)
        {
            meta.success = true;
            res.status(meta.statusCode).json(formatResponse.do(meta,trafficLevel));
        }
        else
        {
            error =  helper.transformToError({code:404,message:"Traffic level not found"}).toCustom();
            return next(error);
        }
    },
    find: function (req, res, next) {
        var query = req.query,
            meta = {statusCode:200, success:false},
            error = {};

        var perPage = query.perPage ? parseInt(query.perPage,"10") : config.get('itemsPerPage.default');
        var page = query.page ? parseInt(query.page,"10") : 1;
        var baseRequestUrl = config.get('app.baseUrl')+config.get('api.prefix')+"/traffic-levels";

        if(page > 1)
        {
            var prev = page - 1;
            meta.pagination.prev = prev;
            meta.pagination.nextPage = baseRequestUrl+"?page="+prev;
        }

        meta.pagination = {perPage:perPage,page:page,currentPage:baseRequestUrl+"?page="+page};
        TrafficLevel.count(function(err , count){
            if(!err)
            {
                meta.pagination.totalCount = count;
                if(count > (perPage * page))
                {
                    var next = ++page;
                    meta.pagination.next = next;
                    meta.pagination.nextPage = baseRequestUrl+"?page="+next;
                }
            }

        });

        TrafficLevel.find()
            .skip(perPage * (page-1))
            .limit(perPage)
            .sort('-createdAt')
            .exec(function (err, trafficLevels) {
                if (err)
                {
                    error =  helper.transformToError({code:503,message:"Error in server interaction"}).toCustom();
                    return next(error);
                }
                else {
                    meta.success = true;
                    res.status(meta.statusCode).json(formatResponse.do(meta,trafficLevels));
                }
            });

    },
    delete: function (req, res, next) {
        var meta = {statusCode:200, success:false},
            error = {},
            trafficLevel = req.trafficLevel;
        if(trafficLevel)
        {
            trafficLevel.remove(); //TODO: Handle errors
            meta.success = true;
            meta.message = "Traffic level deleted!";
            res.status(meta.statusCode).json(formatResponse.do(meta));
        }
        else
        {
            error =  helper.transformToError({code:404,message:"Traffic level not found"}).toCustom();
            return next(error);
        }
    },
    update: function(req, res, next){
        var meta = {statusCode:200, success:false},
            obj = req.body,
            error = {},
            trafficLevel = req.trafficLevel;
            if(trafficLevel)
            {
                _.extend(trafficLevel,obj);
                trafficLevel.save(function (err,savedTrafficLevel) {
                    if(err)
                    {
                        error =  helper.transformToError({code:503,message:"Sorry traffic level could not be updated at this time, try again!"}).toCustom();
                        return next(error);
                    }
                    else
                    {
                        meta.success = true;
                        meta.message = "Traffic level updated!";
                        res.status(meta.statusCode).json(formatResponse.do(meta,savedTrafficLevel));
                    }
                });
            }
            else
            {
                error =  helper.transformToError({code:404,message:"Traffic level not found"}).toCustom();
                return next(error);
            }
    }
};
