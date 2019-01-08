/**
 * author: dkvirus
 * date: 2019年01月08日09:46:01
 * function: 测试接口响应数据结构是否有变化
 */

const clc = require("cli-color");
const differ = require('./differ/index');

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
function traverse2Type (response) {
    const obj = {};
    
    for (let attr in response) {
        if (Object.prototype.toString.call(response[attr]) === '[object Object]') {
            obj[attr] = traverse2Type(response[attr]);
            continue;
        }

        if (Object.prototype.toString.call(response[attr]) === '[object Array]') {
            obj[attr] = [];
            obj[attr].push(traverse2Type(response[attr][0]));
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
function traverse2Value (response) {
    const obj = {};
    
    for (let attr in response) {
        if (Object.prototype.toString.call(response[attr]) === '[object Object]') {
            obj[attr] = traverse2Value(response[attr]);
            continue;
        }

        if (Object.prototype.toString.call(response[attr]) === '[object Array]') {
            obj[attr] = [];
            obj[attr].push(traverse2Value(response[attr][0]));
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
 * 
 * response   请求实际响应数据
 * expect     期待返回数据结构
 */
function handleObject (response, expect) {
    let respResult = traverse2Type(response);
    let { req, res } = expect;
    
    respResult = traverse2Value(respResult);      // 响应数据结构
    const expeResult = traverse2Value(res);       // 期待数据结构

    if (JSON.stringify(respResult) !== JSON.stringify(expeResult)) {
        console.log(clc.red(`>【${req.method} ${req.url}】接口返回数据结构有变化：`))
        console.log(differ(JSON.stringify(expeResult, null, 4), JSON.stringify(respResult, null, 4)));
        throw new Error('数据结构有变化');
    }

}
