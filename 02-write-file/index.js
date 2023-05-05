const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

function close() {
  console.log(exitMsg);
  writeStream.end();
  process.exit();
}

let fileName = 'text-02.txt';
let textTxtPath = path.join(__dirname, fileName);
let exitMsg = 'See you next time!';
let writeStream = fs.createWriteStream(textTxtPath);

// console.log(textTxtPath);
fsPromise.writeFile(textTxtPath, '')
  .then(() => {
    console.log('Введите текст:');
    process.stdin.on('data', data => {
      data = data.toString();
      data.trim() === 'exit' ? close() : writeStream.write(data);
    });
  })
  .catch(err => err);

process.on('SIGINT', () => close());
