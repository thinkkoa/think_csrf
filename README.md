# 介绍
-----

[![Greenkeeper badge](https://badges.greenkeeper.io/thinkkoa/think_csrf.svg)](https://greenkeeper.io/)

[![npm version](https://badge.fury.io/js/think_csrf.svg)](https://badge.fury.io/js/think_csrf)
[![Dependency Status](https://david-dm.org/thinkkoa/think_csrf.svg)](https://david-dm.org/thinkkoa/think_csrf)

CSRF for ThinkKoa.

# 安装
-----

```
npm i think_csrf
```

# 使用
-----
注意: think\_csrf 中间件依赖 think\_chache 中间件,在使用此中间件之前,请安装配置cache中间件

1、项目中增加中间件 middleware/csrf.js
```
module.exports = require('think_csrf');
```

2、项目中间件配置 config/middleware.js:
```
list: [..., 'csrf'], //加载的中间件列表
config: { //中间件配置
    ...,
    csrf: {
        session_name: 'csrf_token', // session存储key
        form_name: '_csrf', // csrf传递参数 key
        header_name: 'x-csrf-token', // csrf使用header传递参数 key
        errno: 403, // 错误码，未通过csrf检测抛出
        errmsg: 'invalid csrf token' // 错误信息，未通过csrf检测抛出
    }
}
```

3、获取CSRF值：

```
// @controller
let csrfVal = this.ctx.csrf;

// @middleware
let csrfVal = ctx.csrf;
```