class Worker {

    constructor(queueManager, flowProvider) {
        this.queueManager = queueManager;
        this.flowProvider = flowProvider;
    }

    async runJob(queueName) {
        const queue = this.queueManager.to(queueName);
        const flow  = this.flowProvider.provide(queue);
        const job   = await this.queueManager.to(queueName).onJob();
        return flow.run(job);
    }
}

module.exports = Worker;