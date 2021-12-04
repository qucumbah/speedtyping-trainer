const fs = require('fs');

const dictionary = JSON.parse(fs.readFileSync('./dictionary.json'));
const definitions = Object.entries(dictionary);

let start = 0;
let index = 0;
while (start < definitions.length) {
  const entriesChunk = definitions.slice(start, start + 1000);
  fs.writeFileSync(`../src/words/batch${index}.ts`, 'export default ' + JSON.stringify(Object.fromEntries(entriesChunk)));
  start += 1000;
  index += 1;
}
