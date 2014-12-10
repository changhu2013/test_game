/**
 * Created by ASRock on 2014/12/10.
 */
var fs = require('fs');
var path = require("path");

function fileutil() {}

fileutil.prototype.mkdirs = function(dirpath, mode, callback) {
	var top = this;
	path.exists(dirpath, function(exists) {
		if(exists) {
			callback(dirpath);
		} else {
			//尝试创建父目录，然后再创建当前目录
			top.mkdirs(path.dirname(dirpath), mode, function(){
				fs.mkdir(dirpath, mode, callback);
			});
		}
	});
};

module.exports = new fileutil();