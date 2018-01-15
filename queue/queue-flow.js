const RetryOnFail = require('../task-behavior/retryOnFail');
const Timeout     = require('../task-behavior/timeout');
const RotateBack  = require('../task-behavior/rotateback');
const Delay       = require('../task-behavior/delay');

class QueueFlow {

    constructor(queue) {
        this.handlerSend    = [];
        this.handlerReceive = [];
        this.queue          = queue;
    }

    delay(time) {
        this.handlerSend.push(
            new Delay(time)
        );
        return this;
    }

    timeout(time) {
        this.handlerReceive.push(
            new Timeout(time)
        );
        return this;
    }

    retry(number) {
        this.handlerReceive.push(new RetryOnFail(number));
        return this;
    }

    pushBack(isPushBack) {
        if (!isPushBack) return this;
        this.handlerReceive.push(new RotateBack(this.queue));
        return this;
    }

    /**
     *
     * @param callback
     * @return {Promise}
     */
    async beforeSend(callback) {
        return this.handlerSend.reduce((previous, current) => {
            return current.handle(previous);
        }, callback)();
    }

    /**
     *
     * @param {Job} job
     * @param {Promise} next
     * @return {Promise}
     */
    afterSend(job, next) {
        return this.handlerReceive.reduce((previousValue, currentValue) => {
            return currentValue.handle(job, previousValue);
        }, next);
    }
}

module.exports = QueueFlow;

// return this.middlewares.reduce((previousValue, currentValue) => {
//     return currentValue.handler(job, previousValue);
// }, job.handler());