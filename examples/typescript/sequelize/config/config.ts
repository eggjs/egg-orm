export default {
  orm: {
    database: 'egg-orm',
    port: process.env.MYSQL_PORT,
    exclude: 'common',
  },

  keys: 'hello',

  security: {
    csrf: false,
  },
};
