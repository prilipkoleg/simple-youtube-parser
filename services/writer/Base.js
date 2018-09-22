const fs = require('fs');
const fsExtra = require('fs-extra');

const config = require('../../config').parser;

class Base {

  constructor() {}

  static validateFileName(fileName) {
    if (!fileName) {
      throw new Error('File name are required!');
    }
  }

  static writeToFile(data, fileNameWithExtension) {
    return new Promise((resolve, reject) => {
      fs
        .writeFile(
          `${config.uploadsDir}/${fileNameWithExtension}`, data, 'binary',
          (error) => error ? reject(error) : resolve()
        )
    });
  }

  static appendToFile(data, fileNameWithExtension) {
    return new Promise((resolve, reject) => {
      fs
        .writeFile(
          `${config.uploadsDir}/${fileNameWithExtension}`, `\n${data}`, {flag: 'a'},
          (error) => error ? reject(error) : resolve()
        )
    });
  }

  static clearUploadsDir() {
    return fsExtra.emptyDir(config.uploadsDir);
  }

  static fileExists(path) {
    try {
      return fs.statSync(`${config.uploadsDir}/${path}`);
    } catch (ex) {}
    return false;
  }
}

module.exports = Base;