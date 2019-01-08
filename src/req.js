/**
 * author: dkvirus
 * date: 2019年01月08日09:46:01
 * function: 测试接口请求是否成功，如果失败，很大可能性是接口名称变化导致的
 */

const axios = require('axios');
const clc = require("cli-color");

module.exports = async function (req) {
    const result = await axios(req);

    if (result.status !== 200 || result.status === 200 && result.data.code !== '0000') {
        console.log(clc.red(`>【${req.method} ${req.url}】接口请求失败`));
        throw new Error('请求失败');
    }

    return result.data;
}

