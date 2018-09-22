const json2csv = require('json2csv').parse;
const Base = require('./Base');

class Csv extends Base {

  constructor() {
    super();
    this.extension = 'csv';
  }

  write(data, fileName) {
    if (!data || !fileName) return Promise.resolve();

    data.forEach(i => 'video_description' in i && delete i.video_description);

    const separator = ';';
    const fileNameWithExtension = `${fileName}.${this.extension}`;
    const fields = Object.keys(data[0]);

    const opts ={
      //fields,
      quote: '',
      //excelStrings: true,
      delimiter: separator
    };
    const dataInCsv = json2csv(data, opts);

    return this.constructor.writeToFile(dataInCsv, fileNameWithExtension);
  }

  writeIntoCommon(data) {
    if (!data) return Promise.resolve();

    data.forEach(i => 'video_description' in i && delete i.video_description);

    const commonFile = `All_in.${this.extension}`;
    const commonOpts = { quote: '', delimiter: ';', };

    if (this.constructor.fileExists(commonFile)){
      const opts = Object.assign({}, commonOpts, {header:false});
      const dataInCsv = json2csv(data, opts);

      return this.constructor.appendToFile(dataInCsv, commonFile);
    }

    const dataInCsv = json2csv(data, commonOpts);

    return this.constructor.writeToFile(dataInCsv, commonFile);
  }
}

module.exports = Csv;