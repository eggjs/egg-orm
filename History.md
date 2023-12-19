2.3.1 / 2023-12-19
==================

## What's Changed
* Add CodeQL workflow for GitHub code scanning by @lgtm-com in https://github.com/eggjs/egg-orm/pull/32
* chore: overwrite the default console.error in logQueryError by @cyjake in https://github.com/eggjs/egg-orm/pull/33

## New Contributors
* @lgtm-com made their first contribution in https://github.com/eggjs/egg-orm/pull/32

**Full Changelog**: https://github.com/eggjs/egg-orm/compare/v2.3.0...v2.3.1

2.3.0 / 2022-11-09
==================

## What's Changed
* feat: rewire prototype of models when subclassing is enabled by @cyjake in https://github.com/eggjs/egg-orm/pull/29


**Full Changelog**: https://github.com/eggjs/egg-orm/compare/v2.2.0...v2.3.0

2.2.0 / 2022-09-08
==================

## What's Changed
* feat: support tegg-egg mixing mode by @JimmyDaddy in https://github.com/eggjs/egg-orm/pull/28


**Full Changelog**: https://github.com/eggjs/egg-orm/compare/v2.1.2...v2.2.0

2.1.2 / 2022-08-31
==================

## What's Changed
* chore: sequelizeBone export app/ctx, doc and example complete by @JimmyDaddy in https://github.com/eggjs/egg-orm/pull/27

**Full Changelog**: https://github.com/eggjs/egg-orm/compare/v2.1.1...v2.1.2

2.1.1 / 2022-08-25
==================

## What's Changed
* docs: ts guide doc by @JimmyDaddy in https://github.com/eggjs/egg-orm/pull/23
* fix: override model.app or model.prototype.app event if exists by @cyjake in https://github.com/eggjs/egg-orm/pull/24
* fix:  sequelize adapter with model extends from Bone directly and export leoric form egg-orm by @JimmyDaddy in https://github.com/eggjs/egg-orm/pull/26


**Full Changelog**: https://github.com/eggjs/egg-orm/compare/v2.1.0...v2.1.1

2.1.0 / 2022-08-24
==================

## What's Changed
* feat: add index.d.ts by @luckydrq in https://github.com/eggjs/egg-orm/pull/17
* test: declaration types integration test by @cyjake in https://github.com/eggjs/egg-orm/pull/18
* chore: elaborate example apps by @cyjake in https://github.com/eggjs/egg-orm/pull/19
* docs: zh readme refabrication by @cyjake in https://github.com/eggjs/egg-orm/pull/20
* fix: readme by @leoner in https://github.com/eggjs/egg-orm/pull/21
* feat: support ts and class model definition by @JimmyDaddy in https://github.com/eggjs/egg-orm/pull/22

## New Contributors
* @luckydrq made their first contribution in https://github.com/eggjs/egg-orm/pull/17
* @leoner made their first contribution in https://github.com/eggjs/egg-orm/pull/21

**Full Changelog**: https://github.com/eggjs/egg-orm/compare/v2.0.0...v2.1.0

2.0.0 / 2022-01-06
==================

## What's Changed
* upgrade: leoric v2.x by @cyjake in https://github.com/eggjs/egg-orm/pull/16


**Full Changelog**: https://github.com/eggjs/egg-orm/compare/v1.1.7...v2.0.0

1.1.7 / 2021-07-09
==================

**fixes**
  * [#15](https://github.com/eggjs/egg-orm/pull/15) - fix: `Model.name` should be consistent (Chen Yangjian <<252317+cyjake@users.noreply.github.com>>)

1.1.6 / 2021-07-06
==================

**fixes**
  * [#14](https://github.com/eggjs/egg-orm/pull/14) - fix: ignore properties injected by egg loader (Chen Yangjian <<252317+cyjake@users.noreply.github.com>>)

1.1.5 / 2021-07-01
==================

**fixes**
  * [#13](https://github.com/eggjs/egg-orm/pull/13) - fix: support Model.app and model.app (Chen Yangjian <<252317+cyjake@users.noreply.github.com>>)

1.1.4 / 2021-06-25
==================

**fixes**
  * [#12](https://github.com/eggjs/egg-orm/pull/12) - fix: allow models be extended from Bone directly to make codebases that use v0.4.x a bit easier to upgrade (Chen Yangjian <<252317+cyjake@users.noreply.github.com>>)

1.1.3 / 2021-06-16
==================

**fixes**
  * [#9](https://github.com/eggjs/egg-orm/pull/9) - fix: ctx.model.ctx injection (Chen Yangjian <<252317+cyjake@users.noreply.github.com>>)

1.1.2 / 2021-03-04
==================

**fixes**
  * [#7](https://github.com/eggjs/egg-orm/pull/7) - fix: ctx is undefined while custom setter executing (jimmydaddy <<heyjimmygo@gmail.com>>)

1.1.1 / 2020-11-30
==================

**fixes**
  * [#5](https://github.com/eggjs/egg-orm/pull/5) - fix: realm.define (jimmydaddy <<heyjimmygo@gmail.com>>)

1.1.0 / 2020-08-12
==================

**fixes**
  * [[`816c27e`](http://github.com/eggjs/egg-orm/commit/816c27ef33b8fc19e43cb0dfa835ff737c8f3551)] - fix delegate and lazy load database (#4) (Yiyu He <<dead_horse@qq.com>>)

1.0.0 / 2020-02-24
==================

**fixes**
  * [[`5a8f304`](http://github.com/eggjs/egg-orm/commit/5a8f304177d59381391e890d92f9e7acd923ca76)] - fix: run in sequelize mode (#3) (fengmk2 <<fengmk2@gmail.com>>),fatal: No names found, cannot describe anything.
