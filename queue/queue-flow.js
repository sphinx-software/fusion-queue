class QueueFlow {

    constructor() {
        this.handlerSend    = [];
        this.handlerReceive = [];
    }

    delay() {
        return this;
    }

    timeout() {
        return this;
    }

    retry() {
        return this;
    }

    pushBack() {
        return this;
    }

    beforeSend(callback) {
        this.handlerSend.reduce((previousValue, currentValue) => {
            return currentValue.handler(previousValue);
        }, callback);
    }

    afterSend(callback) {

    }
}

module.exports = QueueFlow;

// return this.middlewares.reduce((previousValue, currentValue) => {
//     return currentValue.handler(job, previousValue);
// }, job.handler());