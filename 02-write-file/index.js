const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

let fileName = 'text-02.txt';
let textTxtPath = path.join(__dirname, fileName);
let exitMsg = 'See you next time!';

console.log(textTxtPath);
fsPromise.writeFile(textTxtPath, '')
  .then(() => {
    console.log('Введите текст:');
    process.stdin.on('data', data => {
      data = data.toString();
      if (data.trim() === 'exit') {
        console.log(exitMsg);
        process.exit();
      }
      fs.appendFile(fileName, data, (err) => {
        if (err) {
          throw err;
        }
      });
    });
  })
  .catch(err => err);

process.on('SIGINT', () => {
  console.log(exitMsg);
  process.exit();
});
