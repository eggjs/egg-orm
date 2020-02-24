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
      app.logger.info('[egg-sequelize] %s %s', used, args[0]);
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
  const CTX = Symbol('egg-orm:ctx');
  const ORIGINAL_MODEL_CLASS_NAME = Symbol('egg-orm:original_model_class_name');
  const { Model } = app.model;

  Object.defineProperty(app.context, 'model', {
    get() {
      if (this[RPOXY]) return this[RPOXY];

      const ctx = this;
      const proxy = new Proxy(app.model, {
        get(target, property) {
          const injected = this[property];
          if (injected) return injected;

          const OriginModelClass = target[property];
          // ctx.model.ctx
          if (!(OriginModelClass && OriginModelClass.prototype && OriginModelClass.prototype instanceof Model)) {
            return OriginModelClass;
          }

          class ContextModelClass extends OriginModelClass {
            constructor(opts) {
              super(opts);
              this[CTX] = ctx;
              this[ORIGINAL_MODEL_CLASS_NAME] = property;
            }

            get ctx() {
              return this[CTX];
            }
            get $originalModelName() {
              return this[ORIGINAL_MODEL_CLASS_NAME];
            }
          }
          ContextModelClass[CTX] = ctx;
          Object.defineProperty(ContextModelClass, 'ctx', {
            get() {
              return this[CTX];
            },
          });
          // stash injected class onto ctx.model
          this[property] = ContextModelClass;
          return ContextModelClass;
        },
      });

      this[RPOXY] = proxy;
      return proxy;
    },
  });
}

function loadDatabase(app, config) {
  const modelDir = path.join(app.baseDir, 'app', config.baseDir);
  const target = Symbol(config.delegate);
  const models = [];

  const realm = new Realm({ ...config, models });
  const Model = realm.Bone;

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

  for (const model of models) realm[model.name] = model;
  app.model = realm;
  app.model.Model = Model;
  injectContext(app);

  return app.model;
}

async function authenticate(realm) {
  await realm.connect();
}
