const fs = require('fs');
const parh = require('path');
const GoogleApis = require('googleapis');

const config = require('./config');
const stepIterator = require('./services/StepIterator');
const mainParser = require('./services/parcer');
const { youtube_v3 } = GoogleApis;
const baseWriter = require('./services/writer/Base');

const STEP_LIMIT = 50;
const Youtube = new youtube_v3.Youtube({auth: config.main.apiKey});
const channelsList = getChannels();

if (!channelsList.length) throw new Error('channels.csv file contains wrong Data!');

const StepIterator = new stepIterator(
  STEP_LIMIT,
  channelsList,
  (channelId) => {
    const MainParser = new mainParser(Youtube);
    return MainParser.start(channelId);
  }
);

return baseWriter.clearUploadsDir().then(() => StepIterator.iterate());

// helpers -------------------
function getChannels() {
  const channelsFileData = fs.readFileSync(
    parh.join(__dirname, config.main.channelsFile),
    {encoding: 'utf8'}
  );
  return channelsFileData && channelsFileData.split(config.main.channelsFileDelimiter)
    .map(id => id.trim()).filter(id => id);
}