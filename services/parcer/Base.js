const Youtube = require('googleapis').youtube_v3.Youtube;
const { InitializationError } = require('../../errors');

class BaseParser {

  constructor(api) {
    if (!api || !(api instanceof Youtube)) throw InitializationError('Youtube API required!');
    this.api = api;
  }

}

module.exports = BaseParser;