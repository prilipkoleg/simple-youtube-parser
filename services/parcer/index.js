const fs = require('fs');
const fsExtra = require('fs-extra');
const json2xls = require('json2xls');

const Channel = require('./Channel');
const Video = require('./Video');
const config = require('../../config').parser;

class MainParser {

  constructor(api) {
    this.ChannelParser = new Channel(api);
    this.VideoParser = new Video(api);
  }

  start(channelId) {

    return Promise.all([
      this.ChannelParser.getData(channelId),
      this.VideoParser.getData(channelId)
    ])
      .then(([channelInfo, videosInfo]) => videosInfo.map(item => Object.assign({}, channelInfo, item)))
      .then(data => this.constructor.writeToFile(data, channelId))
      .catch(error => console.error(`Channel '${channelId}' error:`/*, error.response*/))
  }

  static writeToFile(data, fileName) {
    const xls = json2xls(data);

    return new Promise((resolve, reject) => {
      fs.writeFile(`${config.uploadsDir}/${fileName}.xlsx`, xls, 'binary', (error) => {
        if (error) return reject(error);
        return resolve();
      })
    });
  }

  static clearUploadsDir() {
    return fsExtra.emptyDir(config.uploadsDir);
  }
}

module.exports = MainParser;