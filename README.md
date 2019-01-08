# TEIN

读音：[tai-ing]（test-interface，取两个单词前两个字符组成），一个简短的接口测试脚本。

## what

你是否遇到过这种情况：前后端分离体系中，后端开发人员通知你接口有改动，前端代码需要做相应调整。but，改了啥没有明确说明，这时候需要一个个页面去点击，一个个按钮去人肉测试。（不能怪后端，有时候改的多了，自个都忘了改了啥，既然如此，还是咱前端解决一劳永逸了吧....）

接口变动主要分两种：
- 接口名称变化；
- 接口返回的数据结构变化。

通过编写测试代码，只要输入 `npm run test` 即可自动测试接口是否正常。

## demo

**Step0：安装依赖**

```
$ npm install tein --save-dev
```

**Step1：编写接口文档**

配置文件：tein.config.js/tein.json/.teinrc

- req 为请求相关参数，用来测试接口是否正确，能访问到；
- res 为响应数据的类型，用来测试返回数据结构是否有变化，新增或删除字段，数据类型是否变化等。

```
// tein.config.js
export default [
  {
    req: {
      url: 'https://novel.dkvirus.top/api/v2/gysw/novel/classify',
      method: 'get',
    },
    res: {
      code: String,
      message: String,
      data: [
        {
          id: Number,
          path: String,
          desc: String,
        },
      ],
    },
  },
];
```

**Step2：修改 package.json 的 script 属性**

执行 tein 命令，会自动去根目录下找 tein.config.js/tein.json/.teinrc 配置文件，如果找不到，不做任何操作；

也可以指定配置文件相对路径，如：`tein ./configs/tein.config.js`。

```
"scripts": {
    "test:interface": "tein"
}
```

## pics

![接口数据结构变动](/docs/images/dein.gif)

## Q & A

oauth2 认证需要先拿到 token，之后每个请求都需要携带 token 请求，怎么测试接口？

参考 [code demo](/test/fixture-object-oauth2) 和 [issue #1](https://github.com/dkvirus/tein/issues/1)

## tools

每次手动转换接口类型超级麻烦，tein 提供可视化操作，`$ tein ui` 命令会启动一个 web 服务，进入 `localhost:28000` 进行操作。

![自动转换响应数据结构](/docs/images/transform.gif)






