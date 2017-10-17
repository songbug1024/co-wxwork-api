WeiXin Work API(ES6版)
=====================
企业微信API。

## 模块状态
- [![NPM version](https://badge.fury.io/js/co-wxwork-api.png)](http://badge.fury.io/js/co-wxwork-api)
- [![Build Status](https://travis-ci.org/slevp/co-wxwork-api.png?branch=master)](https://travis-ci.org/slevp/co-wxwork-api)
- [![Dependencies Status](https://david-dm.org/slevp/co-wxwork-api.png)](https://david-dm.org/slevp/co-wxwork-api)
- [![Coverage Status](https://coveralls.io/repos/slevp/co-wxwork-api/badge.png)](https://coveralls.io/r/slevp/co-wxwork-api)

## 功能列表
- API
	- Crypto Lib（微信服务器消息推送AES加、解密库）
- CorpAPI
	- OAuth API（授权、获取基本信息）
	- JS API（JS SDK配置）
- SuiteAPI
	- 3RD API（第三方套件应用接入）


企业微信官方文档(https://work.weixin.qq.com/api/doc)

订阅号和服务号版本请前往：<https://github.com/node-webot/co-wechat-api>

## Installation

```sh
$ npm install co-wxwork-api
```

## Usage

### 企业微信
```js
var CorpAPI = require('co-wxwork-api').CorpAPI;

var corpAPI = new CorpAPI(corpId, corpSecret);
var result = await corpAPI.getUserIdByCode('code');
```

### 第三方套件
```js
var SuiteAPI = require('co-wxwork-api').SuiteAPI;

var suiteAPI = new SuiteAPI(suiteId, corpSecret);
var result = await suiteAPI.getPreAuthCode();
```

### 多进程
当多进程时，token需要全局维护，以下为保存token的接口。
```
var api = new CorpAPI('corpId', 'corpSecret', async function () {
  // 传入一个获取全局token的方法
  var txt = await fs.readFile('access_token.txt', 'utf8');
  return JSON.parse(txt);
}, async function (token) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  await fs.writeFile('access_token.txt', JSON.stringify(token));
});
```

当多进程时，ticket需要全局维护，以下为保存ticket的接口，一个实例可以包含多种ticket，如：jsapi ticket, suite ticket等
```
var api = new CorpAPI('corpId', 'corpSecret', ...) // 多进程参照上面token保存方式

api.registerTicketHandle(async function (type) {
// 传入一个获取全局ticket的方法
  var txt = await fs.readFile('access_token_' + type + '.txt', 'utf8');
  return JSON.parse(txt);
}, async function (type, ticketToken) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  await fs.writeFile('access_token_' + type + '.txt', JSON.stringify(ticketToken));
});
```

## License
The MIT license.
