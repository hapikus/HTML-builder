const path = require('path');
const fs = require('fs');
const fsPromise = require('fs/promises');

let folderName = 'files';
let folderPath = path.join(__dirname, folderName);
let copyFolderName = 'files-copy';
let copyFolderPath = path.join(__dirname, copyFolderName);

async function getFilesArr(dir) {
  const dirElements = await fsPromise.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirElements.map((dirElem) => {
    const res = path.resolve(dir, dirElem.name);
    return dirElem.isDirectory() ? getFilesArr(res) : res;
  }));
  return files.flat();
}

fsPromise.rm(copyFolderPath, { recursive: true, force: true})
  .then(() => {
    fsPromise.mkdir(copyFolderPath, {recursive: true})
      .then(() => getFilesArr(folderPath))
      .then(arr => {
        arr.forEach(file => {
          let copyFilePath = file.replace(`${path.sep}${folderName}${path.sep}`, `${path.sep}${copyFolderName}${path.sep}`);
          fsPromise.mkdir(path.parse(copyFilePath).dir, {recursive: true})
            .then(()=>fsPromise.copyFile(file, copyFilePath))
            .catch(err => err);
        });
      });
  });
