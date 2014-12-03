/**
 * Created by ASRock on 2014/12/3.
 */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.render('war');
	global.io.emit('aaaa', '123');
});

module.exports = router;
