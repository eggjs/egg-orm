'use strict';

const path = require('path');
const { connect, Bone } = require('leoric');
const sequelize = require('./adaptor/sequelize');

module.exports = app => {
  const defaultConfig = {
    dialect: 'mysql',
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

  const config = app.config.leoric;
  const databases = (config.datasources || [ config ])
    .map(datasource => loadDatabase(app, { ...defaultConfig, datasource }));

  app.beforeStart(async () => {
    await Promise.all(databases.map(authenticate));
  });
};

function createBase(adapter) {
  return adapter === 'sequelize' ? sequelize(Bone) : class extends Bone {};
}

function injectContext(app) {
  const proxy = Symbol('egg-leoric:proxy');

  Object.defineProperty(app.context, 'model', {
    get() {
      const ctx = this;
      const model = this[proxy] || new Proxy(app.model, {
        get(target, property) {
          const injected = this[property];
          if (injected) return injected;

          const origin = target[property];
          if (!origin) throw new Error(`Model ${property} not found`);

          const ContextClass = class extends origin {
            constructor(opts) {
              super(opts);
              this.ctx = ctx;
            }
          };
          ContextClass.ctx = ctx;
          this[property] = ContextClass;
          return ContextClass;
        },
      });
      this[proxy] = model;
      return model;
    },
  });
}

function loadDatabase(app, config = {}) {
  const modelDir = path.join(app.baseDir, 'app', config.baseDir);
  const target = Symbol(config.delegate);
  const models = [];
  let Base = Bone;

  app.loader.loadToApp(modelDir, target, {
    caseStyle: 'upper',
    ignore: config.exclude,
    initializer(factory) {
      if (typeof factory === 'function') {
        if (Base === Bone) Base = createBase(config.adapter);
        return factory(app, Base);
      }
    },
    filter(model) {
      if (model && model.prototype instanceof Base) {
        models.push(model);
        return true;
      }
    },
  });

  app.model = Base;
  injectContext(app);

  return { config, Bone: Base, models };
}

async function authenticate(database) {
  const { config, Bone, models } = database;

  await connect({
    Bone,
    models,
    client: config.dialect,
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
  });
}
