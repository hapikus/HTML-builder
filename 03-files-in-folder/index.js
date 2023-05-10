const path = require('path');
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
            let fileName = file.split('.').slice(0, -1).join('.');
            let fileExtension = file.split('.').at(-1);
            let fileInfo = [fileName, fileExtension, `${Math.floor(stat.size/1024)} kb`];
            console.log(fileInfo.join(' -- '));
          }
        });
    });
  })
  .catch(err => err);
