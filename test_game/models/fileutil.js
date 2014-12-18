/**
 * Created by ASRock on 2014/12/10.
 */
var fs = require('fs');
var path = require("path");
var mime = require('mime');
var urlencode = require('urlencode');

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


fileutil.prototype.download = function(req, res, filepath, filename, callback){

	path.exists(filepath, function (exist) {
		if (exist) {
			fs.stat(filepath, function (error, state) {
				if (error){
					throw error;
				}
				var mimetype = mime.lookup(filepath);
				res.setHeader('Content-disposition', 'attachment; filename=' + urlencode(filename));
				res.setHeader('Content-type', mimetype);
				var stream = fs.createReadStream(filepath);
				stream.on('data', function(chunk){
					res.write(chunk);
				});
				stream.on('end',function(){
					res.end();
					callback();
				})
			});
		}else {
			callback(new Error('文件不存在'));
		}
	});
};

module.exports = new fileutil();