import { Column, DataTypes } from '../../../../..';
import Base from './common/base';

export default class Comment extends Base {
  @Column({ primaryKey: true, autoIncrement: true })
  id: bigint;
  
  @Column(DataTypes.TEXT)
  content: string;

  @Column({ allowNull: false })
  userId: bigint;
};
