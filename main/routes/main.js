var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
