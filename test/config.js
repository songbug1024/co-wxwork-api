module.exports = {
    corpid: 'wx64fd5e7b00f98a40',
    corpsecret: 'RCnW3Uvfh5SlKCocFJlaUUxgFlqgJpKyN2qxzK5LDHrgQJwXw00P4pqH-MeyKDqi',
    agentid: '0',
    test_user: {
        "userid": "coapi",
        "name": "张三",
        "department": [9999],
        "position": "",
        "mobile": "",
        "gender": "1",
        "email": "3344556677@qq.com",
        "weixinid": "",
    },
    test_menu: {
        "button": [{
            "type": "click",
            "name": "今日歌曲",
            "key": "V1001_TODAY_MUSIC"
        }, {
            "name": "菜单",
            "sub_button": [{
                "type": "view",
                "name": "搜索",
                "url": "http://www.soso.com/"
            }, {
                "type": "click",
                "name": "赞一下我们",
                "key": "V1001_GOOD"
            }]
        }]
    }
};
