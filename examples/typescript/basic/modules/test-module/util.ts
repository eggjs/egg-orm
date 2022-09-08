
import { Inject } from '@eggjs/tegg';
import { IModel } from 'egg';

export type InjectParam = {
  name?: keyof IModel;
};

function injectFactory(targetKey, targetName) {
  return (param?: InjectParam) => (target, key: string) => {
    if (!target[targetKey]) {
      Inject({ name: targetName })(target, targetKey);
    }

    Object.defineProperty(target, targetKey, {
      enumerable: false,
      configurable: false,
    });

    Object.defineProperty(target, key, {
      get() {
        return this[targetKey][param?.name || key];
      },
      enumerable: true,
      configurable: true,
    });
  }
}

const modelMetaKey = Symbol.for('model');

export default function InjectModel(param?: InjectParam){
  return injectFactory(modelMetaKey, 'model')(param);
}
