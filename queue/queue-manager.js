const VError = require('verror');

class QueueManager {
    constructor(queues = {}) {
        this.queues = queues;
    }

    setDefault(defaultName) {
        this.defaultName = defaultName;
        return this;
    }

    enqueue(...params) {
        return this.to(this.defaultName).enqueue(...params);
    }

    to(queueName) {
        if (!this.queues[queueName]) {
            throw new VError(`E_QUEUE: queue [${queueName}] not found`);
        }
        return this.queues[queueName];
    }

    exec(...params) {
        this.to(this.defaultName).exec(...params);
    }

    register(queueName, queue) {
        this.queues[queueName] = queue;
        return this;
    }

}

module.exports = QueueManager;