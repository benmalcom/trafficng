/**
 * Created by Ekaruztech on 9/2/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var NodeGeocoder = require('node-geocoder');
var config = require('config');

var TrafficSchema = new Schema({

    level: {type: Schema.Types.ObjectId, ref: 'TrafficLevel'},
    location: {
        landmark: String,
        state: String,
        coordinates: [Number]
    }
},{
    timestamps: true
});
TrafficSchema.index({'location.coordinates': '2dsphere' });

TrafficSchema.pre('save', function(next){
    var data = this;
    if(!data.isModified('location') && (data.location.hasOwnProperty('coordinates') && Array.isArray(data.location.coordinates) && data.location.coordinates.length))
        return next();

    var address = data.location.landmark+" "+data.location.state;
    var geocoder = NodeGeocoder(config.get('googleMapsOptions'));
    geocoder.geocode(address)
        .then(function(res) {
            console.log("res ",res);
            if(Array.isArray(res) && res[0])
            {
                data.location.coordinates = [res[0].longitude,res[0].latitude];
            }
            next();
        })
        .catch(function(err) {
            console.log("geocode error ",err);
            next();
        });
});
TrafficSchema.post('save', function(doc) {
    console.log('%s has been saved', doc._id);
});

TrafficSchema.post('remove', function(doc) {
    console.log('%s has been removed', doc._id);
});

module.exports = mongoose.model('Traffic', TrafficSchema);