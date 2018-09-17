const fs = require('fs');
const parh = require('path');
const GoogleApis = require('googleapis');

const config = require('./config');
const mainParser = require('./services/parcer');

const { youtube_v3 } = GoogleApis;
const Youtube = new youtube_v3.Youtube({auth: config.main.apiKey});

const channelsFileData = fs.readFileSync(
  parh.join(__dirname, config.main.channelsFile),
  {encoding: 'utf8'}
);

const channelsList = channelsFileData && channelsFileData.split(config.main.channelsFileDelimiter)
  .map(id => id.trim()).filter(id => id);

if (!channelsList.length) throw new Error('channels.csv file contains wrong Data!');

const STEP_LIMIT = 50;
const total = channelsList.length;
let done = 0;

function make_step() {
  const promises = [];
  let nextThen = null;
  let finish = false;

  for (let i = 1; i <= STEP_LIMIT; i++) {
    promises.push(
      parseChannel(channelsList[done], done === 0)
    );

    done = done + 1;

    if (done === total) {
      finish = true;
      break;
    }
  }

  if (finish) {
    nextThen = () => console.log('Finished!', `Done: '${done}'`, `Total: '${total}'`);
  } else {
    nextThen = () => {
      console.log('STEP:', `Done: '${done}'`, `Total: '${total}'`);
      return make_step();
    }
  }

  return Promise.all(promises)
    .then(nextThen);
}

function parseChannel(channelId, clearBefore = false) {
  const MainParser = new mainParser(Youtube);

  return (clearBefore)
    ? mainParser.clearUploadsDir().then(() => MainParser.start(channelId))
    : MainParser.start(channelId)
}

return make_step();//.then(() => console.log('Stop'));

//
// const promises = channelsList.map((channelId, index) => {
//   const MainParser = new mainParser(Youtube);
//
//   return (index > 0)
//     ? MainParser.start(channelId)
//     : MainParser.clearUploadsDir().then(MainParser.start(channelId));
// });
//
// return Promise.all(promises)
//   .then(() => console.log('Done!'));