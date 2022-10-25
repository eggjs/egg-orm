import { Column, BelongsTo, DataTypes, SequelizeBone } from '../../../../../';
import Base from './common/base';
import User from './user';

export default class Post extends Base {

  @Column(DataTypes.TEXT)
  content: string;

  @Column({ defaultValue: 'defaultDesc' })
  get description(): string {
    return this.attribute('description') || 'defaultDesc';
  }

  @Column()
  created_at: Date;

  @Column()
  user_id: bigint;

  @BelongsTo()
  user: User;
}
