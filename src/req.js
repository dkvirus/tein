const axios = require('axios');
const chalk = require('chalk');

module.exports = async function (opt) {
    const result = await axios(opt);

    if (result.status !== 200 || result.status === 200 && result.data.code !== '0000') {
        console.log(chalk.red(`【${opt.method} ${opt.url}】请求失败`));
        throw new Error('请求失败');
    }

    return result.data;
}

