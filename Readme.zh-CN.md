# egg-orm

egg-orm 是一个适用于 Egg 框架的数据模型层插件，egg-orm 的对象关系映射能力来自 [Leoric](https://leoric.js.org)。

## 安装

```bash
$ npm i --save egg-orm
$ npm install --save mysql2   # MySQL 或者其他兼容 MySQL 的数据库

# 其他数据库类型
$ npm install --save pg       # PostgreSQL
$ npm install --save sqlite3  # SQLite
```

## 使用

开启 egg-orm 插件即可在 `app/model` 中定义数据模型：

```js
// app/model/user.js
module.exports = function(app) {
  const { STRING } = app.model.DataTypes;

  return app.model.define('User', {
    name: STRING,
    password: STRING,
    avatar: STRING(2048),
  }, {
    tableName: 'users',
  });
}
```

在 Controller 调用：

```js
// app/controller/home.js
const { Controller } = require('egg');
module.exports = class HomeController extends Controller {
  async index() {
    const users = await ctx.model.User.find({
      corpId: ctx.model.Corp.findOne({ name: 'tyrael' }),
    });
    ctx.body = users;
  }
};
```

## 配置

首先开启（并安装） egg-orm 插件

```js
// config/plugin.js
exports.orm = {
  enable: true,
  package: 'egg-orm',
};
```

然后按需配置数据库：

```js
// config/config.default.js
exports.orm = {
  client: 'mysql',
  database: 'temp',
  host: 'localhost',
  baseDir: 'model',
};
```

在上面这个例子中，我们将数据模型定义文件放在 `app/model` 目录，通过 `localhost` 访问 MySQL 中的 `temp` 数据库。推荐阅读 [在 Egg 中使用 Leoric](https://leoric.js.org/setup/egg)一文了解更多有关在 Egg 中使用 egg-orm 和 Leoric 的信息。

## 授权许可

[MIT](LICENSE)
