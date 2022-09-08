import { Context, Application } from 'egg';

import Realm, {
  Bone,
  DataTypes,
  Column, HasMany, HasOne, BelongsTo,
  ConnectOptions, SequelizeBone,
} from 'leoric';

export * from 'leoric';

declare class MySequelizeBone extends SequelizeBone {
  static ctx: Context;
  static app: Application;

  ctx: Context;
  app: Application;

}

declare class MyBone extends Bone {
  static ctx: Context;
  static app: Application;

  ctx: Context;
  app: Application;

}

export { MySequelizeBone as SequelizeBone, MyBone as Bone }

interface EggOrmOptions extends ConnectOptions {
  delegate?: string;
  migrations?: string;
  baseDir?: string;
  define?: {
    underscored?: boolean;
  }
}

interface DataSources {
  datasources: EggOrmOptions[];
}

declare module 'egg' {
  class IModel extends Realm {
    Column: typeof Column;
    HasMany: typeof HasMany;
    HasOne: typeof HasOne;
    BelongsTo: typeof BelongsTo;
    DataTypes: typeof DataTypes;
    Model: typeof Bone | typeof SequelizeBone;
  }

  // extend app
  interface Application {
    model: IModel;
  }

  // extend context
  interface Context {
    model: IModel;
  }

  // extend your config
  interface EggAppConfig {
    orm: EggOrmOptions | DataSources;
  }
}
