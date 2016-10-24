/**
 * Created by Malcom on 9/2/2016.
 */
var router = require('express').Router();
var apiVersion = 'v'+process.env.API_VERSION;
var TrafficController = require('../controllers/'+apiVersion+ '/traffic');

router.route('/traffics')
    .post(TrafficController.create)
    .get(TrafficController.find);

/*traffic_id param*/
router.param('traffic_id',TrafficController.trafficIdParam);
router.route('/traffics/:traffic_id')
    .get(TrafficController.findOne)
    .put(TrafficController.update)
    .delete(TrafficController.delete);
module.exports = router;