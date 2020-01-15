'use strict';

const path = require('path');
const { connect, Bone } = require('leoric');

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
  const proxy = Symbol('egg-orm:proxy');

  Object.defineProperty(app.context, 'model', {
    get() {
      const ctx = this;
      const model = this[proxy] || new Proxy(app.model, {
        get(target, property) {
          if (property === 'ctx') return ctx;

          const injected = this[property];
          if (injected) return injected;

          const origin = target[property];
          if (!origin) {
            throw new Error(`Model ${property} not found`);
          }

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

// TODO: propper multiple database support
function loadDatabase(app, config = {}) {
  const modelDir = path.join(app.baseDir, 'app', config.baseDir);
  const target = Symbol(config.delegate);
  const models = [];

  app.loader.loadToApp(modelDir, target, {
    caseStyle: 'upper',
    ignore: config.exclude,
    initializer(factory) {
      if (typeof factory === 'function') {
        return factory(app, Bone);
      }
    },
    filter(model) {
      if (model && model.prototype instanceof Bone) {
        models.push(model);
        return true;
      }
    },
  });

  app.model = Bone;
  injectContext(app);

  return { config, models };
}

async function authenticate(database) {
  const { config, models } = database;
  console.log(config);
  await connect({ ...config, models });
}
