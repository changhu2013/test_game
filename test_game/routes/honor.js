var express = require('express');
var router = express.Router();

/* 荣誉榜 */
router.get('/list', function(req, res) {
  res.send('荣誉榜');
});

module.exports = router;
