export default {
  orm: {
    database: 'egg-orm',
    port: process.env.MYSQL_PORT,
    exclude: 'common',
    sequelize: true,
  },

  keys: 'hello',

  security: {
    csrf: false,
  },
};
