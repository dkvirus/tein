/**
 * 配置文件导出对象
 * 
 * 用于测试一些公共属性，比如：
 *   apiPrefix  请求前缀统一写
 *   headers    oauth2 认证需要统一携带 headers 头
 */
const path = require('path');
const { tein } = require('../../src/index');
// const start = require('./config');

tein(path.join(__dirname, 'config.js'));

// console.log(start().then(function (result) { console.log(result) }))