/**
 * 配置文件导出数组
 */

const path = require('path');
const { tein } = require('../../src/index');

tein(path.join(__dirname, 'tein.config.js'));