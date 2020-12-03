import jsYaml from 'js-yaml/index.js';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';

const yamlInput = readFileSync('./test.yaml');
const obj = jsYaml.load(yamlInput);
const schemas = obj.components.schemas;

//TODO make this en variable
const isTypeScriptEnabled = true;

if (!existsSync('./generated')) {
    mkdirSync('./generated')
}

const wrtieToFile = async (writeStream, text) => {
    writeStream.write(text);
    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => { resolve() });
        writeStream.on('error', (err) => { reject(err) })
    })
}

const getConstructor = (properties) => {
    const rowOpener = `\tconstructor(`;
    const constructorArguments = properties.join(', ');
    const rowCloser = ') {';

    const constructorWithArgs = [rowOpener, constructorArguments, rowCloser].join('');
    const constructorProperties = properties.map(prop => `\t\tthis.${prop} = ${prop}`).join('\n');
    const constructorCloser = `\t}`;

    return [constructorWithArgs, constructorProperties, constructorCloser].join('\n');
}

const getProperties = (properties) => {
    
}

const getObject = (objectSchema) => {

    let properties = [];

    if (objectSchema.allOf) {

    }

    if (objectSchema.anyOf) {

    }

    if (objectSchema.oneOf) {

    }

    if (objectSchema.properties) {
        Object.keys(objectSchema.properties).forEach(propName => {
            properties.push(propName);
        });
    }

    const fields = properties.map(prop => `\t${prop};\n`).join('')

    const constructor = getConstructor(properties);

    return [fields, constructor].join('');
}

const getObjectsFromYaml = (schemas) => {
    Object.keys(schemas).forEach((schemaItem) => {
        //TODO make upper for schemaItem in class name
        const opener = `export class ${schemaItem} {`;
        const content = getObject(schemas[schemaItem]);
        const closer = `}`;

        const code = [opener, content, closer].join('\n');

        writeFileSync(`./generated/${schemaItem}.js`, code);
        // await wrtieToFile(writeStream, code);
    })
}

getObjectsFromYaml(schemas);

