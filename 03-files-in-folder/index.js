const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

let folderName = 'secret-folder';
let directoryPath = path.join(__dirname, folderName);

fsPromise.readdir(directoryPath)
  .then(files => {
    files.forEach(file => {
      let filePath = path.join(directoryPath, file);
      fsPromise.lstat(filePath)
        .then(stat => {
          if (stat.isFile()) {
            let fileInfo = [...file.split('.'), `${Math.floor(stat.size/1024)} kb`];
            console.log(fileInfo.join(' -- '));
          }
        });
    });
  })
  .catch(err => err);
