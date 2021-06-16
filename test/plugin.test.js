'use strict';

const assert = require('assert').strict;
const mm = require('egg-mock');

describe('test/plugin.test.js', () => {
  let app;

  before(() => {
    app = mm.app({
      baseDir: 'apps/basic',
    });
    return app.ready();
  });

  after(mm.restore);

  describe('app.model', () => {
    it('should be accessible via app.model', () => {
      assert(app.model);
    });
  });

  describe('ctx.model', () => {
    let ctx;

    beforeEach(() => {
      ctx = app.mockContext();
    });

    it('should be accessible via ctx.model by extends', () => {
      assert(ctx.model);
      // access twice to make sure avoiding duplicated model injection
      const User = ctx.model.User;
      assert(ctx.model.User === User);
      assert(ctx.model.User === User);
      assert(ctx.model !== app.model);
      const ctxModel = ctx.model;
      assert(ctx.model === ctxModel);
      assert(ctx.model.User.ctx === ctx);

      const user = ctx.model.User.build({
        nickname: 'foo nickname',
      });
      assert(user.nickname === 'foo nickname');

      const user2 = new ctx.model.User({
        nickname: 'bar nickname',
      });
      console.log(user2.toObject());
      assert(user2.nickname === 'bar nickname');
    });

    it('should be able to access loaded models by extends', () => {
      const { User } = app.model;
      const { User: ContextUser } = ctx.model;

      assert.ok(User);
      assert.ok(User.ctx == null);
      // subclass
      assert.ok(ContextUser.prototype instanceof User);
      assert.equal(ContextUser.ctx, ctx);
    });

    it('should be accessible via ctx.model by define', () => {
      assert(ctx.model);
      // access twice to make sure avoiding duplicated model injection
      const Post = ctx.model.Post;
      assert(ctx.model.Post === Post);
      assert(ctx.model.Post === Post);
      assert(ctx.model !== app.model);
      const ctxModel = ctx.model;
      assert(ctx.model === ctxModel);
      assert(ctx.model.Post.ctx === ctx);

      const post = ctx.model.Post.build({
        description: 'foo nickname',
      });
      assert(post.description === 'foo nickname');

      const post2 = new ctx.model.Post({
        description: 'bar nickname',
      });
      console.log(post2.toObject());
      assert(post2.description === 'bar nickname');
    });

    it('should be able to access loaded models by define', () => {
      const { Post } = app.model;
      const { Post: ContextPost } = ctx.model;

      assert.ok(Post);
      assert.ok(Post.ctx == null);
      // subclass
      assert.ok(ContextPost.prototype instanceof Post);
      assert.equal(ContextPost.ctx, ctx);
    });

    it('should have different models on different contexts', () => {
      const ctx2 = app.mockContext();
      assert.notEqual(ctx.model, ctx2.model);
      assert.notEqual(ctx.model.User, ctx2.model.User);
    });

    describe('GET /users/:id, POST /users', () => {
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
});
