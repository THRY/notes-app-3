var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/kaka', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/', function(req, res, next) {
  res.send('respond with a pipi');
  console.log(req);
});

module.exports = router;
