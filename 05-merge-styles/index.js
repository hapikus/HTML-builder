const path = require('path');
const fsPromise = require('fs/promises');

let folderName = 'styles';
let folderPath = path.join(__dirname, folderName);
let projectFolderName = 'project-dist';
let projectFolderPath = path.join(__dirname, projectFolderName);
let newStyleFileName = 'bundle.css';

let stylesArray = [];

fsPromise.readdir(folderPath)
  .then(files => {
    return Promise.all(files.map(file => {
      if (file.split('.').at(-1) === 'css') {
        let filePath = path.join(folderPath, file);
        return fsPromise.readFile(filePath, 'utf-8')
          .then(data => {
            stylesArray.push(data);
          });
      }
    }));
  })
  .then(() => fsPromise.mkdir(projectFolderPath, {recursive: true}))
  .then(() => fsPromise.writeFile(path.join(projectFolderPath, newStyleFileName), stylesArray.join(' ')));
