const config = require('../../config').parser;
const BaseParser = require('./Base');

class ChannelParser extends BaseParser {

  constructor(api) {
    super(api);
  }

  getData(channelId) {
    const searchOptions = Object.assign({}, {id: channelId}, config.channel);

    return this.api.channels.list(searchOptions)
      .then(this.prepareDataFromResponse)
  }

  prepareDataFromResponse(response) {
    const { status, headers, data } = response;
    const item = data && data.items && data.items[0];
    let channelInfo = {};

    if (!item) return channelInfo;
    channelInfo = {
      'channel_id': item.id,
      'channel_title': item.snippet.title,
      'channel_publishedAt': item.snippet.publishedAt,
      'channel_link': `https://www.youtube.com/user/${item.snippet.customUrl}`,
      //statistics: item.statistics,
    };

    if (item.statistics) {
      Object.entries(item.statistics).forEach(([key, val]) => {
        channelInfo[`channel_${key}`] = val;
      })
    }

    return channelInfo;
  }
}

module.exports = ChannelParser;