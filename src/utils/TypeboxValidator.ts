import { Type, TSchema, Static } from '@sinclair/typebox';
import addFormats from 'ajv-formats';
import Ajv, { ValidateFunction, ErrorObject } from 'ajv/dist/2019';
import { InvalidDataError } from './errors';

export class TypeboxValidator<Schema extends TSchema> {
  validator: ValidateFunction;

  constructor(schema: Schema) {
    // These are things recommended by Typebox
    const typeboxAjv = addFormats(new Ajv({}), [
      'date-time',
      'time',
      'date',
      'email',
      'hostname',
      'ipv4',
      'ipv6',
      'uri',
      'uri-reference',
      'uuid',
      'uri-template',
      'json-pointer',
      'relative-json-pointer',
      'regex',
    ])
      .addKeyword('kind')
      .addKeyword('modifier');

    // Type.Strict omits kind and modifier properties
    this.validator = typeboxAjv.compile(Type.Strict(schema));
  }

  validate(input: unknown): Static<Schema> {
    if (!this.isValid(input)) {
      throw new InvalidDataError({
        message: JSON.stringify(this.validator.errors),
        info: this.validator.errors,
        data: input,
      });
    }
    return input;
  }
  
  isValid(input: unknown): input is Static<Schema> {
    return this.validator(input);
  }
  
  getErrors(): ErrorObject[] {
    const errors = this.validator.errors;
    return errors || [];
  }
}