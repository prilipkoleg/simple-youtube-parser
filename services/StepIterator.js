
class StepIterator {

  constructor(stepLimit, itemsArr, itemHandler) {
    this.options = {
      STEP_LIMIT: stepLimit || 50,
      itemsArr: itemsArr || [],
      itemHandler: itemHandler || (() => {}),
    };
    this.itemIndex = 0;
    this.itemsCount = itemsArr && itemsArr.length || 0
  }

  iterate() {
    if (this.itemsCount === 0) return Promise.resolve();

    const getStepPromise = () => this._makeStep()
      .then(() => {
        const itemsCount = this.itemsCount;
        const done = this.itemIndex;
        const say = (msg) => console.log(`Done: '${done}'`, `Total: '${itemsCount}' -> `, msg)

        if (this._isFinish()) {
          say('FINISHED!');
          return Promise.resolve();
        }

        say('NEXT STEP -->');
        return getStepPromise();
      });

    return getStepPromise();
  }

  _makeStep() {
    const { STEP_LIMIT, itemsArr, itemHandler } = this.options;
    const promises = [];

    for (let i = 1; i <= STEP_LIMIT; i++) {
      promises.push(itemHandler(itemsArr[this.itemIndex]));
      this.itemIndex++;
      if (this._isFinish()) { break; }
    }

    return Promise.all(promises);
  }

  _isFinish() {
    return this.itemIndex === this.itemsCount;
  }
}

module.exports = StepIterator;