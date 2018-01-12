const NullJob   = require('../nullJob');
const QueueFlow = require('./queue-flow');
const nullJob   = new NullJob();

class Queue {
    constructor(transportLayer, serializer) {
        this.transportLayer = transportLayer;
        this.serializer     = serializer;
    }

    /**
     *
     * @param {Job} job
     * @return {Promise<void>}
     */
    enqueue(job) {
        let serializedJob = this.serializer.serialize(job);
        this.buildFlow(job).
            beforeSend(() => this.transportLayer.send(serializedJob));
    }

    buildFlow(job) {
        let queueFlow = new QueueFlow();
        if (!job.flow) return queueFlow;
        job.flow(queueFlow);
        return queueFlow;
    }

    async exec() {
        let job = await this.getJob();
        return this.buildFlow(job).afterSend(() => job.handler());
    }

    async getJob() {
        let jobData = await this.transportLayer.receive();
        if (!jobData) return nullJob;
        return this.serializer.deserialize(jobData);
    }
}

module.exports = Queue;
