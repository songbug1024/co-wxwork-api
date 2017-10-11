WeiXin Work API(ES6版)
=====================
企业微信API。

## 模块状态
- [![NPM version](https://badge.fury.io/js/co-wxwork-api.png)](http://badge.fury.io/js/co-wxwork-api)
- [![Build Status](https://travis-ci.org/slevp/co-wxwork-api.png?branch=master)](https://travis-ci.org/slevp/co-wxwork-api)
- [![Dependencies Status](https://david-dm.org/slevp/co-wxwork-api.png)](https://david-dm.org/slevp/co-wxwork-api)
- [![Coverage Status](https://coveralls.io/repos/slevp/co-wxwork-api/badge.png)](https://coveralls.io/r/slevp/co-wxwork-api)

## 功能列表
- OAuth API（授权、获取基本信息）


企业微信官方文档(https://work.weixin.qq.com/api/doc)

订阅号和服务号版本请前往：<https://github.com/node-webot/co-wechat-api>

## Installation

```sh
$ npm install co-wxwork-api
```

## Usage

```js
var API = require('co-wxwork-api').API;

var api = new API(corpid, corpsecret);
var result = await api.getUserIdByCode('code');
```

### 多进程
当多进程时，token需要全局维护，以下为保存token的接口。
```
var api = new API('corpid', 'corpsecret', async function () {
  // 传入一个获取全局token的方法
  var txt = await fs.readFile('access_token.txt', 'utf8');
  return JSON.parse(txt);
}, async function (token) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  await fs.writeFile('access_token.txt', JSON.stringify(token));
});
```

## License
The MIT license.
