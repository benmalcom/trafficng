/**
 * Created by Malcom on 8/30/2016.
 */

var State = require('../../models/state');
var formatResponse = require('../../shared/format-response');
var Validator = require('validatorjs');
var _ = require('underscore');
var helper = require('../../../utils/helper');
var config = require('config');

module.exports = {
    stateIdParam: function (req,res,next,state_id) {
        State.findById(state_id, function (err, state) {
            if (err) {
                console.error("state_id params error ",err);
                return next(err);
            }
            else {
                req.state =  state;
                next();
            }
        });
    },

    create: function(req, res,next){
        var meta = {statusCode:200, success:false},
            error = {};
        var obj = req.body;
        var rules = {name:'required'};
        var validator = new Validator(obj,rules,{'required.name':"The name of the state is required"});
        if(validator.passes())
        {
            var state = new State(obj);
            state.save(function (err,newState) {
                if(err)
                {
                    error =  helper.transformToError({code:503,message:"Sorry this state could not be saved at this time, try again!"}).toCustom();
                    return next(error);
                }
                else
                {
                    meta.success = true;
                    meta.message = "A new state added!";
                    res.status(meta.statusCode).json(formatResponse.do(meta,newState));
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
            state = req.state,
            error = {};
        if(state)
        {
            meta.success = true;
            res.status(meta.statusCode).json(formatResponse.do(meta,state));
        }
        else
        {
            error =  helper.transformToError({code:404,message:"State not found"}).toCustom();
            return next(error);
        }
    },
    find: function (req, res, next) {
        var meta = {statusCode:200, success:false},
            error = {};

        State.find()
            .sort('name')
            .exec(function (err, states) {
                if (err)
                {
                    error =  helper.transformToError({code:503,message:"Error in server interaction"}).toCustom();
                    return next(error);
                }
                else {
                    meta.success = true;
                    res.status(meta.statusCode).json(formatResponse.do(meta,states));
                }
            });

    },
    delete: function (req, res, next) {
        var meta = {statusCode:200, success:false},
            error = {},
            state = req.state;
        if(state)
        {
            state.remove(); //TODO: Handle errors
            meta.success = true;
            meta.message = "State deleted!";
            res.status(meta.statusCode).json(formatResponse.do(meta));
        }
        else
        {
            error =  helper.transformToError({code:404,message:"State level not found"}).toCustom();
            return next(error);
        }
    },
    update: function(req, res, next){
        var meta = {statusCode:200, success:false},
            obj = req.body,
            error = {},
            state = req.state;
        if(state)
        {
            _.extend(state,obj);
            state.save(function (err,savedState) {
                if(err)
                {
                    error =  helper.transformToError({code:503,message:"Sorry state could not be updated at this time, try again!"}).toCustom();
                    return next(error);
                }
                else
                {
                    meta.success = true;
                    meta.message = "State updated!";
                    res.status(meta.statusCode).json(formatResponse.do(meta,savedState));
                }
            });
        }
        else
        {
            error =  helper.transformToError({code:404,message:"State not found"}).toCustom();
            return next(error);
        }
    }
};

