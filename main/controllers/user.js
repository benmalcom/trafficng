/**
 * Created by Ekaruztech on 9/2/2016.
 */
var User = require('../../models/user'),
    Validator = require('validatorjs'),
    _ = require('underscore'),
    formatResponse = require('../.././format-response'),
    helper = require('../.././helper');

module.exports = {

    changePassword: function (req, res, next) {
        var meta = {statusCode:200, success:false},
            error = {},
            obj = req.body,
            rules = {current_password: 'required',new_password: 'required|min:6'},
            validator = new Validator(obj,rules,{'new_password.required':'Your new password is required','new_password.min':'New password must be at least 6 characters!'});
        if(validator.passes())
        {
            var id = req.docId;

            User.findById(id).exec()
                .then(function (existingUser) {
                    if(!existingUser)
                    {
                        error =  helper.transformToError({code:404,message:"User not found!"});
                        throw error;
                    }
                    else if(existingUser && !existingUser.comparePassword(obj.current_password))
                    {
                        error =  helper.transformToError({code:422,message:"Operation failed, incorrect password!",});
                        throw error;
                    }
                    existingUser.password = obj.new_password;
                    return existingUser.save();
                })
                .then(function (existingUser) {
                    meta.success = true;
                    meta.message = "Password changed successfully!";
                    return res.status(meta.statusCode).json(formatResponse.do(meta,existingUser));
                },function (err) {
                    console.log("Change password error ",err);
                    return next(err);
                });
        }
        else
        {
            error =  helper.transformToError({code:400,message:"There are problems with your input",errors:helper.formatValidatorErrors(validator.errors.all())});
            return next(error);
        }

    },

    changePrimaryMobile: function (req, res, next) {
        var meta = {statusCode:200, success:false},
            error = {},
            obj = req.body,
            rules = {new_mobile: 'required'},
            validator = new Validator(obj,rules,{'new_mobile.required':'Your new primary mobile number is required'});
        if(validator.passes())
        {
            var id = req.docId;

            User.findById(id).exec()
                .then(function (existingUser) {
                    if(!existingUser)
                    {
                        error =  helper.transformToError({code:404,message:"User not found!"});
                        throw error;
                    }

                    existingUser.mobile = obj.new_mobile;
                    return existingUser.save();
                })
                .then(function (existingUser) {
                    meta.success = true;
                    meta.message = "Primary mobile number changed successfully!";
                    return res.status(meta.statusCode).json(formatResponse.do(meta,existingUser));
                },function (err) {
                    console.log("Change primary mobile number error ",err);
                    return next(err);
                });
        }
        else
        {
            error =  helper.transformToError({code:400,message:"There are problems with your input",errors:helper.formatValidatorErrors(validator.errors.all())});
            return next(error);
        }

    },

    changePrimaryEmail: function (req, res, next) {
        var meta = {statusCode:200, success:false},
            error = {},
            obj = req.body,
            rules = {new_email: 'required|email'},
            validator = new Validator(obj,rules,{'new_email.required':'Your new email address is required'});
        if(validator.passes())
        {
            var id = req.docId;

            User.findOne({email:obj.new_email}).exec()
                .then(function (existingUser) {
                    if(existingUser)
                    {
                        error =  helper.transformToError({code:409,message:"A user already exist with your new email!"});
                        throw error;
                    }

                    return User.findById(id).exec();
                })
                .then(function (existingUser) {
                    if(!existingUser)
                    {
                        error =  helper.transformToError({code:404,message:"User not found!"});
                        throw error;
                    }

                    existingUser.email = obj.new_email;
                    return existingUser.save();
                })
                .then(function (existingUser) {
                    meta.success = true;
                    meta.message = "Primary email address changed successfully!";
                    return res.status(meta.statusCode).json(formatResponse.do(meta,existingUser));
                },function (err) {
                    console.log("error here ",err);
                    console.log("Change primary email address error ",err);
                    return next(err);
                });
        }
        else
        {
            error =  helper.transformToError({code:400,message:"There are problems with your input",errors:helper.formatValidatorErrors(validator.errors.all())});
            return next(error);
        }

    }
};
