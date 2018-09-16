const config = {
  activities: {},
  channel: {
    part: 'snippet,statistics',
  },
  search: {
    list: {
      part: 'snippet',
      order: 'date',
      maxResults: 50,
    },
  },
  video: {
    part: 'snippet,statistics',
  },

  // ------
  uploadsDir: 'uploads',
};

module.exports = config;