'use strict';

const path = require('path');
const Realm = require('leoric');

module.exports = class BootHook {
  constructor(app) {
    this.app = app;
    this.databases = [];
  }

  // load models to app in didLoad so that tegg can read the delegate in app/context
  // developer can change the config in configDidLoad method
  async didLoad() {
    const { app } = this;
    const config = app.config.orm;
    const datasources = config.datasources || [ config ];
    // Make multiple copies of Bone to support multiple databases, otherwise use Bone directly
    const subclass = datasources.length > 1;
    this.databases = datasources.map(datasource => {
      return loadDatabase(app, { subclass, ...datasource });
    });
  }

  async willReady() {
    await Promise.all(this.databases.map(authenticate));
  }
};

function createProxy(realm, injects) {
  return new Proxy(realm, {
    get(target, property) {
      const injected = this[property];
      if (injected) return injected;

      // ctx.model.ctx
      if (injects.hasOwnProperty(property)) return injects[property];

      const OriginModelClass = target[property];
      // ctx.model.DataTypes
      if (!(OriginModelClass && Realm.isBone(OriginModelClass))) {
        return OriginModelClass;
      }

      class InjectModelClass extends OriginModelClass {
        static get name() {
          return super.name;
        }
      }
      for (const key of Object.keys(injects)) {
        const value = injects[key];
        for (const target of [ InjectModelClass, InjectModelClass.prototype ]) {
          Object.defineProperty(target, key, {
            get() {
              return value;
            },
          });
        }
      }
      // stash injected class onto ctx.model
      this[property] = InjectModelClass;
      return InjectModelClass;
    },
  });
}

function injectProxy(app, delegate, realm) {
  const PROXY = Symbol('egg-orm:proxy');

  // Object.defineProperty(app, delegate, {
  //   get() {
  //     if (this[PROXY]) return this[PROXY];
  //     const proxy = createProxy(realm, { app });
  //     this[PROXY] = proxy;
  //     return proxy;
  //   },
  // });
  Object.defineProperty(app, delegate, {
    get() {
      return realm;
    },
  });
  Object.defineProperty(realm, 'app', {
    get() {
      return app;
    },
  });
  for (const model of Object.values(realm.models)) {
    for (const target of [ model, model.prototype ]) {
      Object.defineProperty(target, 'app', {
        get() {
          return app;
        },
      });
    }
  }

  Object.defineProperty(app.context, delegate, {
    get() {
      if (this[PROXY]) return this[PROXY];
      const ctx = this;
      const proxy = createProxy(realm, { app: ctx.app, ctx });
      this[PROXY] = proxy;
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
  const { Bone: Model } = realm;

  // be compatible with egg-sequelize
  realm.Model = Model;
  injectProxy(app, delegate, realm);
  // const Bone = config.sequelize? Realm.SequelizeBone : Realm.Bone;

  app.loader.loadToApp(modelDir, target, {
    caseStyle: 'upper',
    ignore: config.exclude,
    initializer(factory) {
      // module.exports = function() {
      //   return Realm.define('name', props);
      // };
      if (typeof factory === 'function' && !Realm.isBone(factory)) {
        factory = factory(app, Model);
      }
      if (!Realm.isBone(factory)) return;

      // class User extends require('leoric').Bone;
      // class User extends (class extends require('leoric').Bone {});
      let klass = factory;
      while (klass !== null) {
        const temp = Object.getPrototypeOf(klass);
        // TODO need a new major version that make base Bone specific in code, sequelize use SequelizeBone, otherwise use Bone
        if (temp === Realm.Bone || temp === Realm.SequelizeBone || temp === Model) {
          break;
        }
        klass = temp;
      }
      if (klass !== Model && !(klass instanceof Model) && Object.getPrototypeOf(klass) !== Model) {
        Object.setPrototypeOf(klass, Model);
        Object.setPrototypeOf(klass.prototype, Object.create(Model.prototype));
      }

      const name = factory.name;
      Object.defineProperty(factory, 'name', { value: name });

      realm[name] = factory;
      return factory;
    },
    filter(model) {
      if (Realm.isBone(model)) {
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

  return realm;
}

async function authenticate(realm) {
  await realm.connect();
}
