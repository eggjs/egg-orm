import { Column, Bone, BelongsTo, DataTypes } from 'leoric';
import User from './user';

export default class Post extends Bone {
  @Column({ primaryKey: true })
  id: bigint;

  @Column(DataTypes.TEXT)
  content: string;

  @Column()
  description: string;

  @Column()
  userId: bigint;

  @BelongsTo()
  user: User;
}
