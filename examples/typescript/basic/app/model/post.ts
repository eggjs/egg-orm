import { Column, Bone, BelongsTo, DataTypes } from '../../../../../';
import User from './user';

export default class Post extends Bone {
  @Column({ primaryKey: true })
  id: bigint;

  @Column(DataTypes.TEXT)
  content: string;

  @Column()
  get description(): string {
    return (this.attribute('description') as string) || 'defaultDesc';
  }

  @Column()
  createdAt: Date;

  @Column()
  userId: bigint;

  @BelongsTo()
  user: User;
}
