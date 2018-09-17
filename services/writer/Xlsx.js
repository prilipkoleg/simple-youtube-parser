const json2xls = require('json2xls');
const Base = require('./Base');

class Xlsx extends Base {

  constructor() {
    super();
    this.extension = 'xlsx';
  }

  write(data, fileName) {
    if (!data || !fileName) return Promise.resolve();

    const xls = json2xls(data);
    const fileNameWithExtension = `${fileName}.${this.extension}`;

    return this.constructor.writeToFile(xls, fileNameWithExtension);
  }
}

module.exports = Xlsx;