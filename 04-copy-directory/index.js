const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

let folderName = 'files';
let folderPath = path.join(__dirname, folderName);
let copyFolderName = 'files-copy';
let copyFolderPath = path.join(__dirname, copyFolderName);

fs.mkdir(copyFolderPath, {recursive: true}, () => {
  fsPromise.readdir(folderPath)
    .then((files) => {
      files.forEach((file) => {
        let filePath = path.join(folderPath, file);
        let copyFilePath =  path.join(copyFolderPath, file);
        fsPromise.copyFile(filePath, copyFilePath)
          .catch(err => err);
      });
    });
});
