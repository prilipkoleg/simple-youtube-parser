const config = {
  activities: {},
  channel: {
    part: 'snippet,statistics',
  },
  search: {
    list: {
      part: 'snippet',
      order: 'date',
      maxResults: 2,
    },
  },
  video: {
    part: 'snippet,statistics',
  },

  // ------
  uploadsDir: '__results',
};

module.exports = config;