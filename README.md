# AVRO typescript converter

Simple tool to convert AVRO schema's to TypeScript interfaces.
Based on [avro-typescript](https://github.com/joewood/avro-typescript), but with several fixes and improvements:

- Added a command line interface
- Stripped namespaces
- Added string enumerations
- Removed duplicated types
- Fixed array types with union arrays
- Uses the recommended naming convention for interfaces (IMyName)
- Added documentation from schema to output

## Installation

Intended to be used globally, so

```bash
npm i -g avro-typescript-converter
```

## Usage

Example:

```bash
avro-typescript-converter example/standard_cap-value.avsc -v
```

or

```bash
npm run example
```

## Build

Install the dependencies and run the compiler:

```bash
npm i
npm start
```
