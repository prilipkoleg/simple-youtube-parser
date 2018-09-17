const json2csv = require('json2csv').parse;
const Base = require('./Base');

class Csv extends Base {

  constructor() {
    super();
    this.extension = 'csv';
  }

  write(data, fileName) {
    if (!data || !fileName) return Promise.resolve();

    //data.forEach(i => 'video_description' in i && delete i.video_description)

    const separator = ';';
    const fileNameWithExtension = `${fileName}.${this.extension}`;
    const fields = Object.keys(data[0]);

    const opts ={
      //fields,
      excelStrings: true,
      delimiter: separator
    };
    const dataInCsv = json2csv(data, opts);

    // const lines = [
    //   header.join(separator),
    //   ...data.map(item => Object.values(item).join(separator))
    // ];

    return this.constructor.writeToFile(dataInCsv, fileNameWithExtension);
  }
}

module.exports = Csv;