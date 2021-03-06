/**
 * Created by Malcom on 8/30/2016.
 */

var Traffic = require('../../models/traffic');
var State = require('../../models/state');

var formatResponse = require('../../shared/format-response');
var io = require('../../shared/io');
var Validator = require('validatorjs');
var _ = require('underscore');
var helper = require('../../../utils/helper');
var config = require('config');

module.exports = {
    trafficIdParam: function (req,res,next,traffic_id) {
        Traffic.findById(traffic_id, function (err, traffic) {
            if (err) {
                console.error("traffic_id params error ",err);
                return next(err);
            }
            else {
                req.traffic = traffic;
                next();
            }
        });
    },

    create: function(req, res,next){
        var meta = {statusCode:200, success:false},
            error = {};
        var obj = req.body;
        var rules = {level:'required',state:'required',landmark:'required'};
        var validator = new Validator(obj,rules,{
                                                 'required.level':"Traffic level is not specified",
                                                 'required.state':"Your state is required is required"
                                                });
        if(validator.passes())
        {
            var state_id = obj.state;
            State.findById(state_id).exec()
                .then(function (state) {
                    if(!state)
                    {
                        error =  helper.transformToError({code:404,message:"State not found!"}).toCustom();
                        throw error;
                    }
                    console.log("state ",state);
                    obj.location = {landmark:obj.landmark};
                    obj.location['state'] = state.name;
                    delete obj.landmark;
                    var traffic = new Traffic(obj);
                    return traffic.save();
                })
                .then(function (savedTraffic) {
                    var populateOptions = [{path:'level'}, {path:'state'}];

                    Traffic.populate(savedTraffic,populateOptions,function(err, populatedTraffic){
                        console.log("new traffic ",populatedTraffic);
                        io.emit('new traffic',populatedTraffic);
                        meta.success = true;
                        meta.message = "You added new traffic information!";
                        res.status(meta.statusCode).json(formatResponse.do(meta,populatedTraffic));
                    });
                    },function (err) {
                        console.log("error ",err);
                        error =  helper.transformToError({code:503,message:"Sorry the traffic information could not be saved at this time, try again!",extra:err}).toCustom();
                        return next(error);
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
            traffic = req.traffic,
            error = {};
        if(traffic)
        {
            meta.success = true;
            res.status(meta.statusCode).json(formatResponse.do(meta,traffic));
        }
        else
        {
            error =  helper.transformToError({code:404,message:"Traffic information not found"}).toCustom();
            return next(error);
        }
    },
    find: function (req, res, next) {
        var query = req.query,
            meta = {statusCode:200, success:false},
            qsSuffix = "",
            queryCriteria = {},
            error = {};
        if(query.landmark)
        {
            queryCriteria['$or'] = [];
            var regEx = new RegExp(query.landmark, "i");
            queryCriteria['$or'].push({'location.landmark':regEx },{'location.street_name':regEx});
            qsSuffix = "?landmark="+query.landmark;
        }
        if(query.state)
        {
            queryCriteria.state = query.state;
            qsSuffix = "?state="+query.state;
        }
        var perPage = query.perPage ? parseInt(query.perPage,"10") : config.get('itemsPerPage.default');
        var page = query.page ? parseInt(query.page,"10") : 1;
        var baseRequestUrl = config.get('app.baseUrl')+config.get('api.prefix')+"/traffics"+qsSuffix;

        if(page > 1)
        {
            var prev = page - 1;
            meta.pagination.prev = prev;
            meta.pagination.nextPage = baseRequestUrl+"?page="+prev;
        }

        meta.pagination = {perPage:perPage,page:page,currentPage:baseRequestUrl+"?page="+page};
        Traffic.count(queryCriteria, function(err , count){
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

        Traffic.find(queryCriteria)
            .skip(perPage * (page-1))
            .limit(perPage)
            .sort('-createdAt')
            .populate('state level')
            .exec(function (err, traffics) {
                if (err)
                {
                    error =  helper.transformToError({code:503,message:"Error in server interaction"}).toCustom();
                    return next(error);
                }
                else {
                    meta.success = true;
                    res.status(meta.statusCode).json(formatResponse.do(meta,traffics));
                }
            });

    },
    delete: function (req, res, next) {
        var meta = {statusCode:200, success:false},
            error = {},
            traffic = req.traffic;
        if(traffic)
        {
            traffic.remove(); //TODO: Handle errors
            meta.success = true;
            meta.message = "Traffic information deleted!";
            res.status(meta.statusCode).json(formatResponse.do(meta));
        }
        else
        {
            error =  helper.transformToError({code:404,message:"Traffic information found"}).toCustom();
            return next(error);
        }
    },
    update: function(req, res, next){
        var meta = {statusCode:200, success:false},
            obj = req.body,
            error = {},
            traffic = req.traffic;
        if(traffic)
        {
            _.extend(traffic,obj);
            traffic.save(function (err,savedTraffic) {
                if(err)
                {
                    error =  helper.transformToError({code:503,message:"Sorry traffic information could not be updated at this time, try again!"}).toCustom();
                    return next(error);
                }
                else
                {
                    meta.success = true;
                    meta.message = "Traffic information updated!";
                    res.status(meta.statusCode).json(formatResponse.do(meta,savedTraffic));
                }
            });
        }
        else
        {
            error =  helper.transformToError({code:404,message:"Traffic information not found"}).toCustom();
            return next(error);
        }
    }
};
