'use strict';

const assert = require('assert');
const mm = require('egg-mock');

describe('test/delegate.test.js', () => {
  let app;

  before(() => {
    app = mm.app({
      baseDir: 'apps/delegate',
    });
    return app.ready();
  });

  after(mm.restore);

  describe('app.orm', () => {
    it('should be accessible via app.orm', () => {
      assert(app.orm);
    });
  });

  describe('ctx.orm', () => {
    let ctx;

    beforeEach(() => {
      ctx = app.mockContext();
    });

    it('should be accessible via ctx.orm', () => {
      assert(ctx.orm);
      // access twice to make sure avoiding duplicated injection
      const User = ctx.orm.User;
      assert(ctx.orm.User === User);
      assert(ctx.orm.User === User);
      assert(ctx.orm !== app.orm);
      const ctxModel = ctx.orm;
      assert(ctx.orm === ctxModel);
      assert(ctx.orm.User.ctx === ctx);

      const user = ctx.orm.User.build({
        nickname: 'foo nickname',
      });
      assert(user.nickname === 'foo nickname');

      const user2 = new ctx.orm.User({
        nickname: 'bar nickname',
      });
      console.log(user2.toObject());
      assert(user2.nickname === 'bar nickname');
    });

    it('should be able to access loaded models', () => {
      const { User } = app.orm;
      const { User: ContextUser } = ctx.orm;

      assert.ok(User);
      assert.ok(User.ctx == null);
      // subclass
      assert.ok(ContextUser.prototype instanceof User);
      assert.equal(ContextUser.ctx, ctx);
    });

    it('should have different models on different contexts', () => {
      const ctx2 = app.mockContext();
      assert.notEqual(ctx.orm, ctx2.orm);
      assert.notEqual(ctx.orm.User, ctx2.orm.User);
    });

    describe('GET /users/:id, POST /users', () => {
      it('should create and get user successfully', async () => {
        const res = await app.httpRequest()
          .post('/users')
          .send({
            nickname: 'rose',
            email: 'rose@example.com',
          });
        assert(res.status === 200);
        assert(res.body.id);
        assert(res.body.nickname === 'rose');
        assert(res.body.email === 'rose@example.com');
        assert(res.body.createdAt);

        const res2 = await app.httpRequest()
          .get(`/users/${res.body.id}`)
          .send({
            nickname: 'rose',
            email: 'rose@example.com',
          });
        assert(res2.status === 200);
        assert.deepEqual(res2.body, res.body);
      });
    });
  });
});
