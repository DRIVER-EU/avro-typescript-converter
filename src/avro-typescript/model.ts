/**** Contains the Interfaces and Type Guards for Avro schema */
export interface Schema {}
export type Type = NameOrType | NameOrType[];
export type NameOrType = TypeNames | RecordType | ArrayType | NamedType;
export type TypeNames = 'record' | 'array' | 'null' | 'map' | string;

export interface Field {
  doc?: string;
  name: string;
  type: Type;
  default?: string | number | null | boolean;
}

export interface BaseType {
  type: TypeNames;
}

export interface RecordType extends BaseType {
  type: 'record';
  name: string;
  fields: Field[];
}

export interface ArrayType extends BaseType {
  type: 'array';
  items: Type;
}

export interface MapType extends BaseType {
  type: 'map';
  values: Type;
}

export interface EnumType extends BaseType {
  type: 'enum';
  name: string;
  symbols: string[];
}

export interface NamedType extends BaseType {
  type: string;
}

export const isRecordType = (type: BaseType): type is RecordType => type.type === 'record';

export const isArrayType = (type: BaseType): type is ArrayType => type.type === 'array';

export const isMapType = (type: BaseType): type is MapType => type.type === 'map';

export const isEnumType = (type: BaseType): type is EnumType => type.type === 'enum';

export const isUnion = (type: Type): type is NamedType[] => type instanceof Array;

export const isOptional = (type: Type): boolean => {
  if (!isUnion(type)) {
    return false;
  }
  const t1 = type[0];
  return typeof t1 === 'string' && t1 === 'null';
};
