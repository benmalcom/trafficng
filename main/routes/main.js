var express = require('express');
var router = express.Router();
var IndexController = require('../controllers/index');


/* GET home page. */
router.get('/',IndexController.index);

router.get('/live-map', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/download', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about-us', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;