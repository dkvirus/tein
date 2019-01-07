const chalk = require('chalk');

module.exports = handleObject;

/**
 * 将响应值转换为数据结构类型
 * 
 *      {
 *          code: '0000',
 *          message: 'xxx',
 *          data: [
 *              { id: 1, path: 'xxx', desc: 'yyy' },
 *              { id: 2, path: 'xxx', desc: 'yyy' }
 *          ]
 *      }
 * 
 *      转换为：(数组只会转换第一条数据的数据类型)
 * 
 *      {
 *          code: String,
 *          message: String,
 *          data: [{
 *                  id: Number,
 *                  path: String,
 *                  desc: String,
 *          }]
 *      }
 */
function traverse (response) {
    const obj = {};
    
    for (let attr in response) {
        if (Object.prototype.toString.call(response[attr]) === '[object Object]') {
            obj[attr] = traverse(response[attr]);
            continue;
        }

        if (Object.prototype.toString.call(response[attr]) === '[object Array]') {
            obj[attr] = [];
            obj[attr].push(traverse(response[attr][0]));
            continue;
        }

        obj[attr] = response[attr].constructor;
        
    }        

    return obj;
}

/**
 *      {
 *          code: String,
 *          message: String,
 *          data: [{
 *                  id: Number,
 *                  path: String,
 *                  desc: String,
 *          }]
 *      }
 * 
 * 这种结构没法比较是否相同，JSON.stringify() 之后会自动变成
 *      {
 *          data: []
 *      }
 * 
 * 将基本类型换成默认值
 * 
 *      {
 *          code: '',
 *          message: '',
 *          data: [{
 *                  id: 0,
 *                  path: '',
 *                  desc: '',
 *          }]
 *      }
 */
function handleDefault (response) {
    const obj = {};
    
    for (let attr in response) {
        if (Object.prototype.toString.call(response[attr]) === '[object Object]') {
            obj[attr] = handleDefault(response[attr]);
            continue;
        }

        if (Object.prototype.toString.call(response[attr]) === '[object Array]') {
            obj[attr] = [];
            obj[attr].push(handleDefault(response[attr][0]));
            continue;
        }

        if (response[attr] === String) {
            obj[attr] = '';
        } else if (response[attr] === Number) {
            obj[attr] = 0;
        } else if (response[attr] === Boolean) {
            obj[attr] = false;
        }
    }        

    return obj;
}


/**
 * 拿期待值与实际响应值进行比较
 * 
 * 期待值有而响应值没有 => 后端删除了该字段值
 * 期待值没有而响应值有 => 后端新增了该字段值
 * 期待值与响应值类型不同 => 后端修改了该字段的数据类型
 */
function handleObject (response, expect) {
    let result = traverse(response);
    let { req, res } = expect;
    
    result = handleDefault(result);
    res = handleDefault(res);
    
    if (JSON.stringify(result) !== JSON.stringify(res)) {
        console.log(chalk.red(`
【${req.method} ${req.url}】请求数据结构有变化：

    期待数据结构：
    ${JSON.stringify(res)}
    实际响应数据结构：
    ${JSON.stringify(result)}        
        `));
        throw new Error('数据结构有变化');
    }

}
