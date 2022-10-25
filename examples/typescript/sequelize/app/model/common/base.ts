import { SequelizeBone, Column, DataTypes } from '../../../../../..';

export default class Base extends SequelizeBone {

  @Column({ primaryKey: true, autoIncrement: true, type: DataTypes.BIGINT })
  id: number;
};
