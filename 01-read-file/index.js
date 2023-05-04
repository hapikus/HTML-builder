const path = require('path');
const fs = require('fs');

let textTxtPath = path.join(__dirname, 'text.txt');
let readStream = fs.createReadStream(textTxtPath, 'utf-8');
readStream.on('data', (chunk) => {
  console.log(chunk.trim());
});
