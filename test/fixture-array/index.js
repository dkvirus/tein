/**
 * 配置文件导出数组
 */

const path = require('path');
const { dein } = require('../../src/index');

dein(path.join(__dirname, 'tein.config.js'));