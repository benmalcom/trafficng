/**
 * Created by Malcom on 10/24/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StateSchema = new Schema({
    name : { type: String}
},{
    timestamps: true
});
StateSchema.post('save', function(doc) {
    console.log('State %s has been saved', doc._id);
});

StateSchema.post('remove', function(doc) {
    console.log('State %s has been removed', doc._id);
});

module.exports = mongoose.model('State', StateSchema);