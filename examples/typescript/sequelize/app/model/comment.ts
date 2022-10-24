import { Column, DataTypes } from '../../../../..';
import Base from './common/base';

export default class Comment extends Base {
  static shardingKey = 'userId';

  @Column(DataTypes.TEXT)
  content: string;

  @Column({ allowNull: false })
  user_id: bigint;
};
