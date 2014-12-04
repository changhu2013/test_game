/**
 * Created by ASRock on 2014/12/3.
 * 战场列表
 */
var express = require("express");
var router = express.Router();

/* GET "users" listing. */
router.get("/", function(req, res) {
	var data = [{
		"wid": "1",
		"users": [{
			"sid": "101",
			"name": "张三"
		}, {
			"sid": "102",
			"name": "李四"
		}, {
			"sid": "103",
			"name": "王五"
		}]
	}, {
		"wid": "2",
		"users": [{
			"sid": "101",
			"name": "张三"
		}, {
			"sid": "103",
			"name": "王五"
		}]
	}, {
		"wid": "3",
		"users": [{
			"sid": "101",
			"name": "张三"
		}, {
			"sid": "102",
			"name": "李四"
		}, {
			"sid": "103",
			"name": "王五"
		}, {
			"sid": "104",
			"name": "赵六"
		}]
	}];

	res.render("wars", {
		data: data
	});
});

module.exports = router;
