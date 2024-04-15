# egg-orm

egg-orm 是一个适用于 Egg 框架的数据模型层插件，支持 JavaScript 和 TypeScript，基于 [Leoric](https://leoric.js.org/zh) 对象关系映射，可以通过 [examples 中的示例项目](https://github.com/eggjs/egg-orm/tree/master/examples) 来快速了解如何在 Egg 应用中配置和使用 egg-orm 插件。

## 安装

```bash
$ npm i --save egg-orm
$ npm install --save mysql    # MySQL 或者其他兼容 MySQL 的数据库

# 其他数据库类型
$ npm install --save pg       # PostgreSQL
$ npm install --save sqlite3  # SQLite
```

## 使用

开启 egg-orm 插件即可在 `app/model` 中定义数据模型：

```js
// app/model/user.js
module.exports = function(app) {
  const { Bone, DataTypes: { STRING } } = app.model;

  return class User extends Bone {
    static table = 'users'

    static attributes = {
      name: STRING,
      password: STRING,
      avatar: STRING(2048),
    }
  });
}
```

也支持试用 TypeScript 编写：

```ts
// app/model/post.ts
import { Column, Bone, BelongsTo, DataTypes } from 'egg-orm';
import User from './user';

export default class Post extends Bone {
  @Column({ primaryKey: true })
  id: bigint;

  @Column(DataTypes.TEXT)
  content: string;

  @Column()
  description: string;

  @Column()
  userId: bigint;

  @BelongsTo()
  user: User;
}

// app/model/user.ts
import { Column, Bone, HasMany } from 'egg-orm';
import Post from './post';

export default class User extends Bone {
  @Column({ allowNull: false })
  nickname: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @HasMany()
  posts: Post[];
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

在上面这个例子中，我们将数据模型定义文件放在 `app/model` 目录，通过 `localhost` 访问 MySQL 中的 `temp` 数据库。推荐阅读 [Egg 应用配置指南](https://leoric.js.org/zh/setup/egg)一文了解更多有关在 Egg 中使用 egg-orm 的帮助文档。

## 迁移任务

egg-orm 支持两种在开发模式维护表结构的方式：

- 类似 Django 的数据模型层，基于模型属性定义自动同步到数据库 `app.model.sync()`
- 类似 Ruby on Rails 的 Active Record，使用迁移任务手动管理表结构

前者比较简单，可以直接在 Egg 应用的 app.js 在 didReady 阶段执行即可：

```js
// app.js
module.exports = class AppBootHook {
  async didReady() {
    const { app } = this;
    if (app.config.env === 'local') {
      // ⚠️ 此操作可能导致数据丢失，请务必谨慎使用
      await app.model.sync({ alter: true });
    }
  }
}
```

因为 `app.model.sync()` 的风险性，使用迁移任务来管理表结构是更为稳妥的方式，在多人协作时也更加方便。目前 egg-orm 还没有提供命令封装，可以调用如下 API 来使用迁移任务：

- 创建迁移任务 `app.model.createMigrationFile()`
- 执行迁移任务 `app.model.migrate(step)`
- 回滚迁移任务 `app.model.rollback(step)`

详细的使用说明可以参考《[迁移任务](https://leoric.js.org/zh/migrations.html)》帮助文档。

## 授权许可

[MIT](LICENSE)
