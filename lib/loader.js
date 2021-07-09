'use strict';

const path = require('path');
const Realm = require('leoric');

module.exports = class BootHook {
  constructor(app) {
    this.app = app;
  }

  // init database in willReady so developer can change the config in didLoad method
  async willReady() {
    const { app } = this;
    const config = app.config.orm;
    const datasources = config.datasources || [ config ];
    // Make muitiple copies of Bone to support multiple databases, otherwise use Bone directly
    const subclass = datasources.length > 1;
    const databases = datasources.map(datasource => {
      return loadDatabase(app, { subclass, ...datasource });
    });
    await Promise.all(databases.map(authenticate));
  }
};

function injectContext(app, delegate) {
  const RPOXY = Symbol('egg-orm:proxy');
  const realm = app[delegate];
  const { Model } = realm;

  Object.defineProperty(app.context, delegate, {
    get() {
      if (this[RPOXY]) return this[RPOXY];

      const ctx = this;
      const proxy = new Proxy(realm, {
        get ctx() {
          return ctx;
        },

        get(target, property) {
          const injected = this[property];
          if (injected) return injected;

          const OriginModelClass = target[property];
          // ctx.model.ctx
          if (!(OriginModelClass && OriginModelClass.prototype && OriginModelClass.prototype instanceof Model)) {
            return OriginModelClass;
          }

          class ContextModelClass extends OriginModelClass {
            static get name() {
              return super.name;
            }
            static get ctx() {
              return ctx;
            }
            // custom setter always execute before define [CTX] when new Instance(super(opts) calling), if custom setter requires ctx, it should not be undefined
            get ctx() {
              return ctx;
            }
          }
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
  const { delegate, ...options } = config;

  const realm = new Realm({ ...options, models });
  const Model = realm.Bone;
  app[delegate] = realm;

  app.loader.loadToApp(modelDir, target, {
    caseStyle: 'upper',
    ignore: config.exclude,
    initializer(factory) {
      if (typeof factory === 'function') {
        // module.exports = class User extends Bone {};
        if (factory.prototype instanceof Model) return factory;
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

  for (const model of models) {
    // make `fullPath` and `pathName` not enumerable to ignore them when serialize
    for (const key of [ 'fullPath', 'pathName' ]) {
      const descriptor = Object.getOwnPropertyDescriptor(model.prototype, key);
      if (descriptor && typeof descriptor.value === 'string') {
        Object.defineProperty(model.prototype, key, {
          ...descriptor,
          writable: true,
          enumerable: false,
          configurable: true,
        });
      }
    }
    realm[model.name] = model;
  }
  for (const target of [ Model, Model.prototype ]) {
    Object.defineProperty(target, 'app', {
      get() {
        return app;
      },
      configurable: true,
      enumerable: false,
    });
  }
  app[delegate].Model = Model;
  injectContext(app, delegate);

  return app[delegate];
}

async function authenticate(realm) {
  await realm.connect();
}
