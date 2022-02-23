# egg-orm

[中文介绍](Readme.zh-CN.md)

Yet another object-relational mapping plugin for Egg, which is based on [Leoric](https://leoric.js.org).

## Install

```bash
$ npm i --save egg-orm
$ npm install --save mysql2   # MySQL or compatible dialects

# Or use other database backend.
$ npm install --save pg       # PostgreSQL
$ npm install --save sqlite3  # SQLite
```

## Usage

With egg-orm you can define models in `app/model`:

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

and use them like below:

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

## Configuration

Firstly, enable egg-orm plugin:

```js
// config/plugin.js
exports.orm = {
  enable: true,
  package: 'egg-orm',
};
```

Secondly, configure the plugin accordingly:

```js
// config/config.default.js
exports.orm = {
  client: 'mysql',
  database: 'temp',
  host: 'localhost',
  baseDir: 'model',
};
```

In this example above, we're accessing the `temp` database of MySQL via `localhost` with the models defined in directory `app/model`. For more information, please refer to [Setup Leoric in Egg](https://leoric.js.org/setup/egg).

## License

[MIT](LICENSE)
