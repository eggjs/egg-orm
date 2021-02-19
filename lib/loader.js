'use strict';

const path = require('path');
const Realm = require('leoric');

const defaultConfig = {
  client: 'mysql',
  delegate: 'model',
  baseDir: 'model',
  logging(...args) {
    // if benchmark enabled, log used
    const used = typeof args[1] === 'number' ? `(${args[1]}ms)` : '';
    app.logger.info('[egg-orm] %s %s', used, args[0]);
  },
  host: 'localhost',
  port: 3306,
  username: 'root',
  define: {
    freezeTableName: false,
    underscored: true,
  },
};

module.exports = class BootHook {
  constructor(app) {
    this.app = app;
  }

  // init database in willReady so developer can change the config in didLoad method
  async willReady() {
    const { app } = this;
    const config = app.config.orm;
    const databases = (config.datasources || [config])
      .map(datasource => loadDatabase(app, { ...defaultConfig, ...datasource }));
    await Promise.all(databases.map(authenticate));
  }
};


function injectContext(app, delegate) {
  const RPOXY = Symbol('egg-orm:proxy');
  const CTX = Symbol('egg-orm:ctx');
  const ORIGINAL_MODEL_CLASS_NAME = Symbol('egg-orm:original_model_class_name');
  const realm = app[delegate];
  const { Model } = realm;

  Object.defineProperty(app.context, delegate, {
    get() {
      if (this[RPOXY]) return this[RPOXY];

      const ctx = this;
      const proxy = new Proxy(realm, {
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
              this[ORIGINAL_MODEL_CLASS_NAME] = property;
            }

            // custom setter always execute before define [CTX] when new Instance(super(opts) calling), if custom setter requires ctx, it should not be undefined
            get ctx() {
              return ctx;
            }
            get $originalModelName() {
              return this[ORIGINAL_MODEL_CLASS_NAME];
            }
          }
          Object.defineProperty(ContextModelClass, 'ctx', {
            get() {
              return ctx;
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
  app[config.delegate] = realm;

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
  app[config.delegate].Model = Model;
  injectContext(app, config.delegate);

  return app[config.delegate];
}

async function authenticate(realm) {
  await realm.connect();
}
