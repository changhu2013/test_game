var moment = require('moment');
var Schema = require('mongoose').Schema;

var formater = 'YYYY-MM-DD HH:mm:ss';

var util = function(){};

var dateFormat = function(date){
    if(date instanceof Date){
        return moment(date).format(formater);
    }else {
        return date;
    }
};

var toJSON = function(schema){
    var temp = {};
    if(schema && schema._doc){
        var doc = schema._doc;
        for(var k in doc){
            var v = schema.get(k);
            if(v instanceof Date){//先判断是否是日期类型
                temp[k] = dateFormat(v);
            }else if(v instanceof Object){//在判断是不是一个对象
                temp[k] = toJSON(v);
            }else {
                temp[k] = v;
            }
        }
    }
    return temp;
};

/**
 * 时间格式处理
 * @param scheme
 * @param field
 * @returns {*}
 */
util.prototype.dateFormat = dateFormat;

/**
 * 将一个对象转换成JSON格式
 *
 * @param data
 * @returns {Array}
 */
util.prototype.toJSON = function(data){
    if(data instanceof Array){
        var temp = [];
        for(var i = 0, len = data.length; i < len; i++){
            temp.push(toJSON(data[i]));
        }
        return temp;
    }else {
        return toJSON(data);
    }
}

module.exports = new util();