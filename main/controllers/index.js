/**
 * Created by Malcom on 10/24/2016.
 */
var Traffic = require('../../api/models/traffic');

module.exports = {

    index : function(req, res, next){
        var error = {};
        Traffic.find()
            .limit(10)
            .sort('-createdAt')
            .populate('state level')
            .exec(function (err, traffics) {
                if (err)
                {
                    error =  helper.transformToError({code:503,message:"Error in server interaction"}).toCustom();
                    return next(error);
                }
                else {
                    console.log("Traffics ",traffics);
                    res.render('index',{title:'Traffic9ja | Welcome',traffics:traffics});
                }
            });
    }
};
