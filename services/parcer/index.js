const Channel = require('./Channel');
const Video = require('./Video');
const writers = require('../writer');
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
      // .then(data => {
      //   const CsvWriter = new writers.Csv();
      //   const XlsxWriter = new writers.Xlsx();
      //   return XlsxWriter.write(data, channelId);
      // })
      .catch(error => console.error(`Channel '${channelId}' error:`, /*error*/))
  }


}

module.exports = MainParser;