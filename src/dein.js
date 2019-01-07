const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const req = require('./req');
const res = require('./res');

// 判断是否有参数
const { argv, cwd } = process;
const configDir = cwd();
let configFile = '';
if (argv.length > 2) {
    configFile = path.join(configDir, argv[2]);
}

/**
 * 统计用
 * 
 * statistics = [
 *      {
 *          url: 'xxx',
 *          method: 'get',
 *          status: 1,
 *      },
 *      {
 *          url: 'xxx',
 *          method: 'get',
 *          status: -1,
 *      }
 * ]
 */
let statistics = [];

// 配置文件优先级：tein.config.js > tein.json > .teinrc.js
if (fs.existsSync(path.join(configDir, 'tein.config.js'))) {
    configFile = path.join(configDir, 'tein.config.js');
} else if (fs.existsSync(path.join(configDir, 'tein.json'))) {
    configFile = path.join(configDir, 'tein.json');
} else if (fs.existsSync(path.join(configDir, '.teinrc.js'))) {
    configFile = path.join(configDir, '.teinrc.js');
} else {
    console.log(chalk.red('没有找到 tein 配置文件'));
    return;
}

const config = require(configFile)

// 判断是数组还是对象
if (Object.prototype.toString.call(config) === '[object Array]') {
    handleBatch(config);
} else if (Object.prototype.toString.call(config) === '[object Object]') {
    let { apiPrefix, apis } = config;
    apis = apis.map(item => `${apiPrefix}${item.req.url}` );
    handleBatch(apis);
} else {
    return console.log('配置文件内容格式不正确');
}

async function handleBatch (arr) {
    for (let i of arr) {
        await handleSingle(i);
    }

    const success = statistics.filter(item => item.status > 0).length;
    console.log(chalk.green(`

总共测试 ${statistics.length} 个接口，成功 ${success} 个，失败 ${statistics.length - success}
    
    `));
}

async function handleSingle (opt) {
    statistics.push({
        url: opt.req.url,
        method: opt.req.method,
        status: 1,
    });

    try {
        const result = await req(opt.req);  // 测试接口请求是否成功
        res(result, opt);                   // 测试接口响应数据结构是否有变化
    } catch (e) {
        statistics = statistics.map(item => {
            if (item.url === opt.req.url && item.method === opt.req.method) {
                item.status = -1;
                item.message = e;
            } 
            return item;
        }) 
    }
}

