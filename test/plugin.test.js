'use strict';

const assert = require('assert');
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

    it('should be accessible via ctx.model', () => {
      assert.ok(ctx.model);
      assert.equal(ctx.model.ctx, ctx);
      // access twice to make sure avoiding duplicated model injection
      assert.equal(ctx.model.User, ctx.model.User);
      assert.ok(ctx.model !== app.model);
      assert.equal(ctx.model.ctx, ctx);
    });

    it('should be able to access loaded models', () => {
      const { User } = app.model;
      const { User: ContextUser } = ctx.model;

      assert.ok(User);
      assert.ok(User.ctx == null);
      // subclass
      assert.ok(ContextUser.prototype instanceof User);
      assert.equal(ContextUser.ctx, ctx);
    });

    it('should have different models on different contexts', () => {
      const ctx2 = app.mockContext();
      assert.notEqual(ctx.model, ctx2.model);
      assert.notEqual(ctx.model.User, ctx2.model.User);
    });
  });
});
