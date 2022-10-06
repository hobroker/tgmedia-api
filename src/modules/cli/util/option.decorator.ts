import { OptionMetadata } from 'nest-commander';
import { OptionMeta } from 'nest-commander/src/constants';

const applyMethodMetadata =
  (options: any, metadataKey: string): MethodDecorator =>
  (
    _target: Record<string, any>,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(metadataKey, options, descriptor.value);

    return descriptor;
  };

interface CustomOptionMetadata extends OptionMetadata {
  defaultValue: any;
}

export const Option = (options: CustomOptionMetadata): MethodDecorator => {
  return applyMethodMetadata(options, OptionMeta);
};
