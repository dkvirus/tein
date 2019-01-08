/**
 * bin 入口文件
 */
const path = require('path');
const fs = require('fs');
const clc = require("cli-color");

const req = require('./req');   // 测试接口能否发通
const res = require('./res');   // 测试接口数据结构是否变化 
const pkg = require('../package.json');

module.exports = start;

/**
 * 入口文件
 */
async function start (file) {
    const filePath = file || getConfigFilePath();
    if (!filePath) {
        // 没有找到，打印版本号
        console.log(clc.white(`${pkg.version}`));
        return;
    }

    // 获取配置文件内容
    const config = require(filePath);

    let apis = [];

    try {
        apis = await handleConfig(config);
    } catch (e) {
        return console.log(clc.red(e));
    }

    handleBatch(apis);
}

/**
 * 获取配置文件绝对路径
 */
function getConfigFilePath () {
    const { argv, cwd } = process;

    // 是否有参数，有的话读取文件内容
    const configDir = cwd();

    // 配置文件优先级：tein.config.js > tein.json > .teinrc.js
    if (argv.length > 2) {
        return path.join(configDir, argv[2]);     // 相对路径
    } else if (fs.existsSync(path.join(configDir, 'tein.config.js'))) {
        return path.join(configDir, 'tein.config.js');
    } else if (fs.existsSync(path.join(configDir, 'tein.json'))) {
        return path.join(configDir, 'tein.json');
    } else if (fs.existsSync(path.join(configDir, '.teinrc.js'))) {
        return path.join(configDir, '.teinrc.js');
    } else {
        return 0;
    }
}

/**
 * 处理配置文件
 * 配置文件可能会传数组、对象、函数，传入类型不同，处理方式不同
 */
async function handleConfig (config) {
    // 处理数组
    if (Object.prototype.toString.call(config) === '[object Array]') {
        return config;
    } else 
    // 处理对象
    if (Object.prototype.toString.call(config) === '[object Object]') {

        // 处理通用属性
        let { apiPrefix = '', apis, headers = {} } = config;
        apis = apis.map(item => {
            if (item.req && item.req.url !== '') {
                const req = item.req;

                if (!req.method) { req.method = 'GET' }
                if (!req.headers) { req.headers = {} }

                req.url = `${apiPrefix}${req.url}`;
                req.headers = { ...req.headers, ...headers };
            }
            return item;
        } );

        return apis;
    } else 
    // 处理函数
    if (typeof config === 'function') {
        config = await config();
        
        // 处理通用属性
        let { apiPrefix = '', apis, headers = {} } = config;
        apis = apis.map(item => {
            if (item.req && item.req.url !== '') {
                const req = item.req;

                if (!req.method) { req.method = 'GET' }
                if (!req.headers) { req.headers = {} }

                req.url = `${apiPrefix}${req.url}`;
                req.headers = { ...req.headers, ...headers };
            }
            return item;
        } );

        return apis;
    } else {
        return 0;
    }
}

/**
 * 批量测试
 */
async function handleBatch (apis = []) {
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

    for (let api of apis) {
        statistics.push({
            url: api.req.url,
            method: api.req.method,
            status: 1,
        });

        try {
            await handleSingle(api);
        } catch (e) {
            statistics = statistics.map(item => {
                if (item.url === api.req.url && item.method === api.req.method) {
                    item.status = -1;
                    item.message = e;
                } 
                return item;
            }) 
        }
        
    }

    const success = statistics.filter(item => item.status > 0).length;
    console.log(`
总共测试 ${clc.green(statistics.length)} 个接口，
成功 ${clc.green(success)} 个，
失败 ${clc.red(statistics.length - success)} 个。
    `);
}

/**
 * 测试单个接口
 */
async function handleSingle (api) {
    const result = await req(api.req);  // 测试接口请求是否成功
    res(result, api);                   // 测试接口响应数据结构是否有变化
}


