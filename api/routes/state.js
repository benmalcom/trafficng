/**
 * Created by Malcom on 10/24/2016.
 */

var config = require('config');
var router = require('express').Router();
var apiVersion = 'v'+process.env.API_VERSION;
var StateController = require('../controllers/'+apiVersion+ '/state');


router.route('/states')
    .post(StateController.create)
    .get(StateController.find);

/*state_id param*/
router.param('state_id',StateController.stateIdParam);
router.route('/states/:state_id')
    .get(StateController.findOne)
    .put(StateController.update)
    .delete(StateController.delete);
module.exports = router;
