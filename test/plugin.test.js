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

  describe('Base', () => {
    it('should be accessible from app', () => {
      assert(app.model);
    });

    it('should be accessible from ctx as well', () => {
      const ctx = app.mockContext();
      assert.ok(ctx.model);
      assert.equal(ctx.model.ctx, ctx);
      // needs to avoid duplicating module injection
      assert.equal(ctx.model.User, ctx.model.User);
      assert.ok(ctx.model !== app.model);
    });
  });
});
