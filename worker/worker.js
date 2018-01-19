class Worker {

    constructor(queueManager, flowProvider) {
        this.queueManager = queueManager;
        this.flowProvider = flowProvider;
    }

    async runJob(queueName) {
        const queue = this.queueManager.to(queueName);
        const job   = await this.queueManager.to(queueName).onJob();
        const flow  = this.flowProvider.provide(job, queue);
        return flow.run(job);
    }
}

module.exports = Worker;
