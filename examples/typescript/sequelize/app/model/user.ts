import { Column, HasMany, DataTypes } from '../../../../../';
import Base from './common/base';
import Post from './post';

export default class User extends Base {

  @Column({ allowNull: false })
  nickname: string;

  @Column()
  email: string;

  @Column()
  created_at: Date;

  @HasMany()
  posts: Post[];

  @Column(DataTypes.VIRTUAL)
  get userAppName(): string {
    return `${this.app.name}${this.nickname}`
  }
}
