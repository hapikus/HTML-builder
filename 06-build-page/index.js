const path = require('path');
const fsPromise = require('fs/promises');

// HTML
let HTMLFilePath = path.join(__dirname, 'template.html');
let HTMLTemplateArray = [];
let componentsNameArray = [];
let HTMLCompFinderRegexp = /{{.*}}/g;
let HTMLDataString = '';

async function HTMLTemplateReader() {
  await fsPromise.readFile(HTMLFilePath, 'utf-8')
    .then(data => {
      HTMLTemplateArray.push(data);
    })
    .then(() => {
      componentsNameArray = [...HTMLTemplateArray.join(' ').matchAll(HTMLCompFinderRegexp)];
      // componentsArray[0][0], componentsArray[0].index
    });
  return true;
}

// components HTML
let compFolderPath = path.join(__dirname, 'components');
let compArray = new Map();

async function componentsReader() {
  await fsPromise.readdir(compFolderPath)
    .then(files => {
      return Promise.all(files.map(file => {
        if (file.split('.').at(-1) === 'html') {
          let filePath = path.join(compFolderPath, file);
          return fsPromise.readFile(filePath, 'utf-8')
            .then(data => {
              compArray.set(file.split('.')[0], data);
            });
        }
      }));
    });
  return true;
}

// css
let stylesArray = [];

async function cssReader() {
  let folderName = 'styles';
  let folderPath = path.join(__dirname, folderName);
  let projectFolderName = 'project-dist';
  let projectFolderPath = path.join(__dirname, projectFolderName);
  let newStyleFileName = 'style.css';

  await fsPromise.readdir(folderPath)
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
}

// assets
let assetsFolderName = 'assets';
let assetsFolderPath = path.join(__dirname, assetsFolderName);

// Project
let projectFolderName = 'project-dist';
let projectFolderPath = path.join(__dirname, projectFolderName);
let HTMLProjectFileName = 'index.html';

Promise.all([
  HTMLTemplateReader(),
  componentsReader(),
])
  .then(() => {
    HTMLDataString = HTMLTemplateArray.join(' ');
    componentsNameArray.forEach(compName => {
      let compNameFind = compName[0];
      let compNameMapKey = compName[0].slice(2, -2);
      HTMLDataString = HTMLDataString.replace(compNameFind, compArray.get(compNameMapKey));
    });
  })
  .then(() => fsPromise.mkdir(projectFolderPath, {recursive: true}))
  .then(() => fsPromise.writeFile(path.join(projectFolderPath, HTMLProjectFileName), HTMLDataString))
  .then(() => cssReader())
  .then(() => fsPromise.cp(
    assetsFolderPath, path.join(__dirname, projectFolderName, assetsFolderName),
    {recursive: true}));
