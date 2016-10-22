/**
 * Created by Malcom on 9/11/2016.
 */
var config = require('config');
var router = require('express').Router();
var multer = require('multer');
var apiVersion = 'v'+process.env.API_VERSION;
var TrafficLevelController = require('../controllers/'+apiVersion+ '/traffic-level');
var checkToken = require('../../api/middlewares/auth_token');


router.route('/traffic-levels')
    .post(TrafficLevelController.create)
    .get(TrafficLevelController.find);

/*traffic_level_id param*/
router.param('traffic_level_id',TrafficLevelController.trafficLevelIdParam);
router.route('/traffic-levels/:traffic_level_id')
    .get(TrafficLevelController.findOne)
    .put(TrafficLevelController.update)
    .delete(TrafficLevelController.delete);

module.exports = router;
