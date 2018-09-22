const BaseParser = require('./Base');
const config = require('../../config').parser;

class VideoParser extends BaseParser {

  constructor(api) {
    super(api);
  }

  getData(channelId) {
    const searchOptions = Object.assign({}, { channelId }, config.search.list);

    return this.api.search.list(searchOptions)
      .then(({ status, headers, data }) => {
        const videoItems = data && data.items && data.items;

        if (!videoItems) return null;

        return Promise.all(
          videoItems.map((item) => {
            const videoId = item.id.videoId;
            if (!videoId) return Promise.resolve();
            const videoOptions = Object.assign({}, { id: videoId }, config.video);

            return this.api.videos.list(videoOptions)
              .then(this.prepareDataFromResponse);
          })
        );
      })
  }



  prepareDataFromResponse(response) {
    const { status, headers, data } = response;
    const item = data && data.items && data.items[0];
    let videoInfo = {};

    if (!item) return videoInfo;

    videoInfo = {
      'video_id': item.id,
      'video_publishedAt': item.snippet.publishedAt,
      'video_title': item.snippet.title,
      'video_description': item.snippet.description,
      'video_link': `https://www.youtube.com/watch?v=${item.id}`,
      'video_tags': item.snippet.tags && item.snippet.tags.length && item.snippet.tags.join(',') || '',
      // statistics: item.statistics,
    };

    if (item.statistics) {
      Object.entries(item.statistics).forEach(([key, val]) => {
        videoInfo[`video_${key}`] = val;
      })
    }

    return videoInfo;
  }

}

module.exports = VideoParser;