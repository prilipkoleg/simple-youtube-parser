const Channel = require('./Channel');
const Video = require('./Video');
const writers = require('../writer');
const config = require('../../config').parser;

class MainParser {

  constructor(api) {
    this.api = api;
    this.ChannelParser = new Channel(api);
    this.VideoParser = new Video(api);
  }

  start(channelIdOrUserName) {

    return this.getChannelId(channelIdOrUserName)
      .then((channelId) => Promise.all([
        this.ChannelParser.getData(channelId),
        this.VideoParser.getData(channelId)
      ]))
      .then(([channelInfo, videosInfo]) => {
        const data = videosInfo.map(item => Object.assign({}, channelInfo, item));

        const XlsxWriter = new writers.Xlsx();
        const CsvWriter = new writers.Csv();

        XlsxWriter.write(data, channelIdOrUserName);
        CsvWriter.writeIntoCommon(data);

        return data;
      })
      .catch(error => console.error(
        `Channel '${channelIdOrUserName}' error:`,
        //error
      ));
  }

  getChannelId(channelIdOrUserName) {
    return new Promise((resolve, reject) => {
      const defaultOptions = {part: 'snippet', maxResults: 1};

      return this.api.channels.list(Object.assign({}, {id: channelIdOrUserName}, defaultOptions))
        .then((response) => {
          const { status, headers, data } = response;
          if (data && data.items && !data.items.length) {
            return Promise.reject('This is Not channelId');
          }
          resolve(channelIdOrUserName);
        })
        .catch(error => {
          this.api.channels.list(Object.assign({}, {forUsername: channelIdOrUserName}, defaultOptions))
            .then(response => {
              const { status, headers, data } = response;
              const item = data && data.items && data.items[0];
              const channelId = item && item.id;

              return channelId && resolve(channelId) || reject('Channel not valid')
            })
            .catch(reject);
        })
    });
  }

}

module.exports = MainParser;