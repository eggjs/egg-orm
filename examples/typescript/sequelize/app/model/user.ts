import { Column, SequelizeBone, HasMany, DataTypes } from '../../../../../';
import Post from './post';

export default class User extends SequelizeBone {

  @Column({
    primaryKey: true,
    type: DataTypes.BIGINT,
  })
  id: number;

  @Column({ allowNull: false })
  nickname: string;

  @Column()
  email: string;

  @Column()
  createdAt: Date;

  @HasMany()
  posts: Post[];

  @Column(DataTypes.VIRTUAL)
  get userAppName(): string {
    return `${this.app.name}${this.nickname}`
  }
}
