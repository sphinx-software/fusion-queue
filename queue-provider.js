const VError = require('verror');

class QueueProvider {
    constructor(queues = {}) {
        this.queues = queues;
    }

    provide(queueName) {
        if (!this.queues[queueName]) {
            throw new VError(`E_QUEUE: queue [${queueName}] not found`);
        }
        return this.queues[queueName];
    }

    register(queueName, queue) {
        this.queues[queueName] = queue;
        return this;
    }

    exec(queueName) {
        return this.provide(queueName).compose();
    }

    execAll() {
        return Promise.all(this.queues.keys().map(this.exec.bind(this)));
    }

}

module.exports = QueueProvider;