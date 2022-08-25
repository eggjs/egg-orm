import Realm, {
  Bone,
  DataTypes,
  Column, HasMany, HasOne, BelongsTo,
  ConnectOptions,
} from 'leoric';

export * from 'leoric';

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
    Model: typeof Bone;
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
