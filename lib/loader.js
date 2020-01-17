'use strict';

const path = require('path');
const Realm = require('leoric');

module.exports = app => {
  const defaultConfig = {
    client: 'mysql',
    delegate: 'model',
    baseDir: 'model',
    logging(...args) {
      // if benchmark enabled, log used
      const used = typeof args[1] === 'number' ? `(${args[1]}ms)` : '';
      app.logger.info('[egg-sequelize]%s %s', used, args[0]);
    },
    host: 'localhost',
    port: 3306,
    username: 'root',
    define: {
      freezeTableName: false,
      underscored: true,
    },
  };

  const config = app.config.orm;
  const databases = (config.datasources || [ config ])
    .map(datasource => loadDatabase(app, { ...defaultConfig, ...datasource }));

  app.beforeStart(async () => {
    await Promise.all(databases.map(authenticate));
  });
};

function injectContext(app) {
  const RPOXY = Symbol('egg-orm:proxy');
  const { Model } = app.model;

  Object.defineProperty(app.context, 'model', {
    get() {
      const ctx = this;
      const proxy = this[RPOXY] || new Proxy(app.model, {
        get(target, property) {
          const injected = this[property];
          if (injected) return injected;

          const origin = target[property];
          // ctx.model.ctx
          if (!(origin && origin.prototype && origin.prototype instanceof Model)) {
            return origin;
          }

          class ContextClass extends origin {
            constructor(opts) {
              super(opts);
              this.ctx = ctx;
            }
          }
          ContextClass.ctx = ctx;
          // stash injected class onto ctx.model
          this[property] = ContextClass;
          return ContextClass;
        },
      });
      proxy.ctx = ctx;
      this[RPOXY] = proxy;
      return proxy;
    },
  });
}

function loadDatabase(app, config = {}) {
  const modelDir = path.join(app.baseDir, 'app', config.baseDir);
  const target = Symbol(config.delegate);
  const models = [];
  class Model extends Realm.Bone {}

  app.loader.loadToApp(modelDir, target, {
    caseStyle: 'upper',
    ignore: config.exclude,
    initializer(factory) {
      if (typeof factory === 'function') {
        return factory(app, Model);
      }
    },
    filter(model) {
      if (model && model.prototype instanceof Model) {
        models.push(model);
        return true;
      }
    },
  });

  const realm = new Realm({ ...config, Model, models });
  for (const model of models) realm[model.name] = model;
  app.model = realm;
  injectContext(app);

  return app.model;
}

async function authenticate(realm) {
  await realm.connect();
}
