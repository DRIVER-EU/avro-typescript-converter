import {
    avroToTypeScript,
    RecordType
} from "avro-typescript"
import * as fs from 'fs'
import * as path from 'path'
import * as commandLineArgs from 'command-line-args'

const optionDefinitions = [{
        name: 'input',
        alias: 'i',
        type: String,
        multiple: true
    },{
        name: 'verbose',
        alias: 'v',
        type: Boolean
    },
    {
        name: 'outFolder',
        alias: 'o',
        type: String
    }
]
const options: {input: string[], verbose: boolean, outFolder: string} = commandLineArgs(optionDefinitions)

function convert() {
    if (!options || !options.input) return;
    if (!options.outFolder) options.outFolder = 'output';
    options.input.forEach(input => {
        const schemaText = fs.readFileSync(input, "UTF8");
        const schema = JSON.parse(schemaText) as RecordType;
        var inputName = path.basename(input);
        const outFile = inputName.concat('.ts');
        const outPut = avroToTypeScript(schema as RecordType);
        fs.writeFileSync(path.join(options.outFolder, outFile), outPut, "UTF8");
        if (options.verbose) {
            console.log(outPut);
            console.log("is written to " + outFile);
        }
    });
}

convert();
console.log('done');