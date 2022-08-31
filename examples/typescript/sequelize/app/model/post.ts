import { Column, BelongsTo, DataTypes, SequelizeBone } from '../../../../../';
import User from './user';

export default class Post extends SequelizeBone {
  @Column({ primaryKey: true })
  id: bigint;

  @Column(DataTypes.TEXT)
  content: string;

  @Column()
  get description(): string {
    return (this.attribute('description') as string) || 'defaultDesc';
  }

  @Column()
  userId: bigint;

  @BelongsTo()
  user: User;
}
