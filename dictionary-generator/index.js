const fs = require('fs');
const path = require('path');

const dictionary = JSON.parse(fs.readFileSync(path.join(__dirname, './dictionary.json')));
const definitions = Object.entries(dictionary).map(([word, description]) => `${word} - ${description}`.trim());

const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = lowercase.toUpperCase();
const numerals = '0123456789';
const specials = '`~!@#$%^&*()-_=+[]{}\\|/,.<>? ;:\'"';

const allowedCharacters = new Set([...lowercase, ...uppercase, ...numerals, ...specials]);
function onlyContainsAllowedCharacters(definition) {
  return Array.from(definition).every((character) => allowedCharacters.has(character));
}

function hasCorrectLength(definition) {
  return definition.length >= 40 && definition.length <= 100;
}

const allowedDefinitions = definitions.filter((definition) => (
  onlyContainsAllowedCharacters(definition)
  && hasCorrectLength(definition)
));

const definitionsDir = path.resolve(__dirname, '../src/definitions');
if (fs.existsSync(definitionsDir)) {
  fs.rmSync(definitionsDir, { recursive: true });
}
fs.mkdirSync(definitionsDir);

const batchSize = 1000;
for (let batchNumber = 0; batchNumber * batchSize < allowedDefinitions.length; batchNumber += 1) {
  const definitionsChunk = allowedDefinitions.slice(batchNumber * batchSize, (batchNumber + 1) * batchSize);

  fs.writeFileSync(
    path.join(definitionsDir, `batch${batchNumber}.ts`),
    'export default ' + JSON.stringify(definitionsChunk, null, 2),
  );
}
