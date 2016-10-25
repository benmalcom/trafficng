/**
 * Created by Malcom on 9/9/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrafficLevelSchema = new Schema({
    name : { type: String},
    color : {type: String, defaultsTo:"info"}
},{
    timestamps: true
});

TrafficLevelSchema.post('save', function(doc) {
    console.log('TrafficLevel %s has been saved', doc._id);
});

TrafficLevelSchema.post('remove', function(doc) {
    console.log('TrafficLevel %s has been removed', doc._id);
});

module.exports = mongoose.model('TrafficLevel', TrafficLevelSchema);