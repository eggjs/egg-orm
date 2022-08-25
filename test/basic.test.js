'use strict';

const assert = require('assert').strict;
const mm = require('egg-mock');
const path = require('path');

describe('test/basic.test.js', () => {
  let app;

  before(() => {
    app = mm.app({
      baseDir: path.join(__dirname, '../examples/basic'),
    });
    return app.ready();
  });

  after(mm.restore);

  describe('app.model', function() {
    it('should be accessible via app.model', function() {
      assert(app.model);
      assert(app.model.User);
    });

    it('should be able to access app from model', async function() {
      assert(app.model.User.app);
      assert((new app.model.User()).app);
    });
  });

  describe('GET /users/:id, POST /users', () => {
    beforeEach(async function() {
      await app.model.User.truncate();
    });

    it('should create and get user successfully', async () => {
      const res = await app.httpRequest()
        .post('/users')
        .send({
          nickname: 'jack',
          email: 'jack@example.com',
        });
      assert(res.status === 200);
      assert(res.body.id);
      assert(res.body.nickname === 'jack');
      assert(res.body.email === 'jack@example.com');
      assert(res.body.createdAt);

      const res2 = await app.httpRequest()
        .get(`/users/${res.body.id}`)
        .send({
          nickname: 'jack',
          email: 'jack@example.com',
        });
      assert(res2.status === 200);
      assert.deepEqual(res2.body, res.body);
    });
  });
});
