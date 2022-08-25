export default {
  orm: {
    database: 'egg-orm',
    sequelize: true,
    port: process.env.MYSQL_PORT,
  },

  keys: 'hello',

  security: {
    csrf: false,
  },
};
