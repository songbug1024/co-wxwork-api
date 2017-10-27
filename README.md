WeiXin Work API(ES6版)
=====================
企业微信API。

## 模块状态
- [![NPM version](https://badge.fury.io/js/co-wxwork-api.png)](http://badge.fury.io/js/co-wxwork-api)
- [![Build Status](https://travis-ci.org/slevp/co-wxwork-api.png?branch=master)](https://travis-ci.org/slevp/co-wxwork-api)
- [![Dependencies Status](https://david-dm.org/slevp/co-wxwork-api.png)](https://david-dm.org/slevp/co-wxwork-api)
- [![Coverage Status](https://coveralls.io/repos/slevp/co-wxwork-api/badge.png)](https://coveralls.io/r/slevp/co-wxwork-api)

## 功能列表
- API 企业微信API基类
  - Crypto Lib（微信服务器消息推送AES加、解密库）
- CorpAPI 企业微信自建应用API
  - OAuth API（授权、获取基本信息）
  - JS API（JS SDK配置）
  - 通讯录管理
    - User API（成员管理）
    - Department API（部门管理）
    - Tag API（标签管理）
    - Batch API（异步任务管理）
- SuiteAPI 企业微信套件API
  - 3RD API（第三方应用）
- SuiteCorpAPI 企业微信套件应用API，继承自CorpAPI，包含CorpAPI的所有API
- ProviderAPI 企业微信服务商API
  - OAuth API（商户授权）

企业微信官方文档(https://work.weixin.qq.com/api/doc)

订阅号和服务号版本请前往：<https://github.com/node-webot/co-wechat-api>

## Installation

```sh
$ npm install co-wxwork-api
```

## Usage

### 创建自建应用API实例
```js
const CorpAPI = require('co-wxwork-api').CorpAPI;

const corpAPI = new CorpAPI(corpId, corpSecret);
const result = await corpAPI.getUserIdByCode('code');
```

### 创建套件API实例
```js
const SuiteAPI = require('co-wxwork-api').SuiteAPI;

const suiteAPI = new SuiteAPI(suiteId, suiteSecret);
const result = await suiteAPI.getPreAuthCode();
```

### 创建套件应用API实例
```js
const {SuiteAPI, SuiteCorpAPI} = require('co-wxwork-api');

// 实例化套件API
const suiteAPI = new SuiteAPI(suiteId, suiteSecret);

//... 根据授权企业ID获取永久授权码
const permanentCode = getPermanentCode...(authCorpId)

// 实例化套件应用API
const suiteCorpAPI = new SuiteCorpAPI(suiteAPI, authCorpId, permanentCode);
const result = await corpAPI.getUserIdByCode('code');
```

### 多进程
当多进程或多机器时，token需要全局维护，以下为多进程保存token的接口。
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

当多进程或多机器时，ticket需要全局维护，以下为保存ticket的接口，一个实例可以包含多种ticket，如：jsapi ticket, suite ticket等
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
