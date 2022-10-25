import { strict as assert } from 'assert';
import mm from 'egg-mock';
import path from 'path';

describe('test/typesript/basic/plugin.test.ts', () => {
  let app;

  before(() => {
    mm.restore();
    app = mm.app({
      baseDir: path.join(__dirname, '../../examples/typescript/basic'),
    });
    return app.ready();
  });

  after(mm.restore);

  describe('app.model', () => {
    it('should be accessible via app.model', () => {
      assert(app.model);
      assert(app.model.User);
    });

    it('should be able to access app from model', async function() {
      assert(app.model.User.app);
      assert((new app.model.User()).app);
    });
  });

  describe('models', () => {
    it('should be accessible via app.model[name]', () => {
      assert.ok(app.model.User.models);
      assert.ok(app.model.User.models.User);
      assert.ok(app.model.User.models.Post);
    });

    it('should be accessible via ctx.model[name]', () => {
      const ctx = app.mockContext();
      assert.ok(ctx.model.User.models);
      assert.ok(ctx.model.User.models.User);
      assert.ok(ctx.model.User.models.Post);
    });
  });

  describe('ctx.model', () => {
    let ctx;

    beforeEach(() => {
      ctx = app.mockContext();
    });

    it('should be accessible via ctx.model by extends', async () => {
      assert(ctx.model);
      // access twice to make sure avoiding duplicated model injection
      const User = ctx.model.User;
      assert(ctx.model.User === User);
      assert(ctx.model.User === User);
      assert(ctx.model !== app.model);
      const ctxModel = ctx.model;
      assert(ctx.model === ctxModel);
      assert(ctx.model.User.ctx === ctx);
      assert((new ctx.model.User()).ctx === ctx);
      assert(ctx.model.User.app);
      assert((new ctx.model.User()).app);
      assert(ctx.model.User.name === 'User');

      const user = new ctx.model.User({
        nickname: 'foo nickname',
      });
      // FIXME content should not exist in Post
      assert.ok(!ctx.model.User.attributes['content']);
      assert(user.nickname === 'foo nickname');
      await user.save();

      const user2 = new ctx.model.User({
        nickname: 'bar nickname',
      });
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

      const { Post } = app.model;
      const p = new Post();
      assert.equal(p.description, 'defaultDesc');
      const p1 = new ctx.model.User.models.Post();
      assert.equal(p1.description, 'defaultDesc');
    });

    it('should be accessible via ctx.model by define', async () => {
      assert(ctx.model);
      // access twice to make sure avoiding duplicated model injection
      const Post = ctx.model.Post;
      assert(ctx.model.Post === Post);
      assert(ctx.model.Post === Post);
      assert(ctx.model !== app.model);
      const ctxModel = ctx.model;
      assert(ctx.model === ctxModel);
      assert(ctx.model.Post.ctx === ctx);

      const post = new ctx.model.Post({
        description: 'foo nickname',
      });
      assert(post.description === 'foo nickname');
      // FIXME nickname should not exist in Post
      assert.ok(!Post.attributes['nickname']);
      await post.save();
      assert.ok(post.id);

      const post2 = new ctx.model.Post({
        description: 'bar nickname',
      });
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
      // should ignore properties injected by egg loader
      assert(res.body.fullPath == null);
      assert(res.body.pathName == null);

      // should not interfere JSON dump
      assert(res.body.hasOwnProperty('ctx') === false);
      assert(res.body.hasOwnProperty('app') === false);

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

  describe('tegg-module-mixing', () => {
    it('should work', async () => {
      const ctx = await app.mockModuleContext();

      const user = await ctx.model.User.create({
        nickname: 'jerry',
        email: 'jerry@example.com',
      });

      assert.ok(user);

      const res =  await ctx.module.testModule.helloService.sayHello(user.id);

      assert.equal(res, 'hello jerry');
    });
  });
});
