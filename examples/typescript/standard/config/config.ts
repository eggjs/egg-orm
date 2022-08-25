export default {
  orm: {
    database: 'egg-orm',
    port: process.env.MYSQL_PORT,
  },

  keys: 'hello',

  security: {
    csrf: false,
  },
};
