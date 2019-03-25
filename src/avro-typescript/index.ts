/** Original sources https://github.com/joewood/avro-typescript */
import {
  Type,
  Field,
  isRecordType,
  isArrayType,
  isEnumType,
  isMapType,
  RecordType,
  EnumType,
  isOptional,
} from './model';
import { createDocumentation } from '../utils';
export { RecordType } from './model';

const interfaces = {} as { [key: string]: string };

/** Convert a primitive type from avro to TypeScript */
export const convertPrimitive = (avroType: string) => {
  switch (avroType) {
    case 'long':
    case 'int':
    case 'double':
    case 'float':
      return 'number';
    case 'bytes':
      return 'Buffer';
    case 'null':
      return 'null | undefined';
    case 'boolean':
      return 'boolean';
    default:
      const cleanName = stripNamespace(avroType);
      return interfaces.hasOwnProperty(cleanName) ? interfaces[cleanName] : cleanName;
  }
};

/** Converts an Avro record type to a TypeScript file */
export const avroToTypeScript = (recordType: RecordType): string => {
  const output: string[] = [];
  convertRecord(recordType, output);
  return output.join('\n');
};

const stripNamespace = (name: string) => name.split('.').pop() as string;

/** Convert an Avro Record type. Return the name, but add the definition to the file */
const convertRecord = (recordType: RecordType, buffer: string[]): string => {
  const doc = document(recordType);
  const cleanName = `I${stripNamespace(recordType.name)}`;
  const interfaceDef = `${doc}export interface ${cleanName} {
${recordType.fields.map(field => convertFieldDec(field, buffer)).join('\n')}
}
`;
  buffer.push(interfaceDef);
  interfaces[recordType.name] = cleanName;
  return cleanName;
};

/** Convert an Avro Enum type. Return the name, but add the definition to the file */
const convertEnum = (enumType: EnumType, buffer: string[]): string => {
  const doc = document(enumType);
  const enumDef = `${doc}export enum ${enumType.name} {
\t${enumType.symbols.map(s => `${s} = '${s}'`).join(',\n\t')}
}\n`;
  buffer.push(enumDef);
  return enumType.name;
};

const convertType = (type: Type, buffer: string[]): string => {
  // if it's just a name, then use that
  if (typeof type === 'string') {
    return convertPrimitive(type);
  } else if (type instanceof Array) {
    const isUnique = (value: any, index: number, arr: any[]) => arr.indexOf(value) === index;
    // array means a Union. Use the names and call recursively
    return type
      .map(t => stripNamespace(convertType(t, buffer)))
      .map(n => (interfaces.hasOwnProperty(n) ? interfaces[n] : n))
      .filter(isUnique)
      .join(' | ');
  } else if (isRecordType(type)) {
    // record, use the name and add to the buffer
    return convertRecord(type, buffer);
  } else if (isArrayType(type)) {
    const isUnion = (s: string) => s.indexOf('|') >= 0;
    // array, call recursively for the array element type
    const name = stripNamespace(convertType(type.items, buffer));
    const properName = interfaces.hasOwnProperty(name) ? interfaces[name] : name;
    return isUnion(properName) ? `Array<${properName}>` : `${properName}[]`;
    // return `${convertType(type.items, buffer)}[]`;
  } else if (isMapType(type)) {
    // Dictionary of types, string as key
    return `{ [key: string]: ${convertType(type.values, buffer)} }`;
  } else if (isEnumType(type)) {
    // array, call recursively for the array element type
    return convertEnum(type, buffer);
  } else {
    console.error('Cannot work out type', type);
    return 'UNKNOWN';
  }
};

const convertFieldDec = (field: Field, buffer: string[]): string => {
  const doc = document(field, '\t');
  const type = convertType(field.type, buffer);
  const replacedType = interfaces.hasOwnProperty(type) ? interfaces[type] : type;
  return `${doc}\t${field.name}${isOptional(field.type) ? '?' : ''}: ${replacedType};`;
};

/** Create documentation, if it exists */
const document = (field: Field, indent = '') => createDocumentation(field.doc, 80, indent);
  // (field.doc ? document(`${indent}/** ${fold(field.doc)} */`) : '');

/** Add the documentation to the output */
// const document = (doc: string) => `${doc}${doc ? '\n' : ''}`;
