import Realm, { DataTypes, Bone, ConnectOptions } from 'leoric';

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