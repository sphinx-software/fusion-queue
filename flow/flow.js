const RetryOnFail = require('../task-behavior/retryOnFail');
const Timeout     = require('../task-behavior/timeout');
const RotateBack  = require('../task-behavior/rotateback');
const Delay       = require('../task-behavior/delay');

class Flow {

    constructor(queue) {
        this.handler = [];
        this.queue   = queue;
    }

    delay(time = 0) {
        this.handler.push(
            new Delay(time)
        );
        return this;
    }

    timeout(time) {
        this.handler.push(
            new Timeout(time)
        );
        return this;
    }

    retry(number = 0) {
        this.handler.push(new RetryOnFail(number));
        return this;
    }

    pushBack(isPushBack) {
        if (!isPushBack) return this;
        this.handler.push(new RotateBack(this.queue));
        return this;
    }

    /**
     *
     * @param {Job} job
     * @return {Promise}
     */
    run(job) {
        return this.handler.reduce((previousValue, currentValue) => {
            return currentValue.handle(job, previousValue);
        }, job);
    }
}

module.exports = Flow;
