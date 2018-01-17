const VError = require('verror');

class QueueManager {
    constructor(queues = {}) {
        this.queues = queues;
    }

    /**
     *
     * @param defaultName
     * @return {QueueManager}
     */
    setDefault(defaultName) {
        this.defaultName = defaultName;
        return this;
    }

    /**
     *
     * @param queueName
     * @param queue
     * @return {QueueManager}
     */
    register(queueName, queue) {
        this.queues[queueName] = queue;
        return this;
    }

    /**
     *
     * @param queueName
     * @return {Queue}
     */
    to(queueName) {
        if (!this.queues[queueName]) {
            throw new VError(`E_QUEUE: queue [${queueName}] not found`);
        }
        return this.queues[queueName];
    }

    /**
     *
     * @param params
     * @return {Promise<void>|Promise<*>}
     */
    enqueue(...params) {
        return this.to(this.defaultName).enqueue(...params);
    }

    /**
     *
     * @return {Promise<Job>}
     */
    onJob() {
        return this.to(this.defaultName).onJob();
    }

}

module.exports = QueueManager;
