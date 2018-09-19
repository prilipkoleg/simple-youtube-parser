const fs = require('fs');
const parh = require('path');
const GoogleApis = require('googleapis');

const config = require('./config');
const stepIterator = require('./services/StepIterator');
const mainParser = require('./services/parcer');
const { youtube_v3 } = GoogleApis;
const { Xlsx: xlsxWriter, Csv: csvWriter } = require('./services/writer');

const STEP_LIMIT = 5;
const Youtube = new youtube_v3.Youtube({auth: config.main.apiKey});
const channelsList = getChannels();

if (!channelsList.length) throw new Error('channels.csv file contains wrong Data!');

const StepIterator = new stepIterator(
  2,
  channelsList,
  (channelId) => {
    const MainParser = new mainParser(Youtube);
    return MainParser.start(channelId);
  }
);

return StepIterator.iterate();



let storage = [];
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
    // nextThen = () => console.log('Finished!', `Done: '${done}'`, `Total: '${total}'`);
    nextThen = () => {
      console.log('Finished!', `Done: '${done}'`, `Total: '${total}'`);
      const XlsxWriter = new xlsxWriter();
      console.log(storage.length);
      return XlsxWriter.write(storage, 'all_in')
    }
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
  const promise = clearBefore
    ? xlsxWriter.clearUploadsDir().then(() => MainParser.start(channelId))
    : MainParser.start(channelId);

  return promise.then((data) => storage = storage.concat(data));
}

return make_step();//.then(() => console.log('Stop'));

// helpers -------------------
function getChannels() {
  const channelsFileData = fs.readFileSync(
    parh.join(__dirname, config.main.channelsFile),
    {encoding: 'utf8'}
  );
  return channelsFileData && channelsFileData.split(config.main.channelsFileDelimiter)
    .map(id => id.trim()).filter(id => id);
}