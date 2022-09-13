import { SequelizeBone } from '../../../../../..';

export default class Base extends SequelizeBone {
  static shardingKey = 'userId';
};
