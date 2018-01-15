const NullJob          = require('../nullJob');
const QueueFlowFactory = require('./queue-folow.factory');
const queueFlowFactory = new QueueFlowFactory();
const nullJob          = new NullJob();

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
        return this.buildFlow(job).
            beforeSend(() => this.transportLayer.send(serializedJob));
    }

    /**
     *
     * @param {Job} job
     * @return {QueueFlow}
     */
    buildFlow(job) {
        return queueFlowFactory.makeFromConfig(job.flow, this);
    }

    async exec() {
        let job = await this.getJob();
        return this.buildFlow(job).afterSend(job, job.handle());
    }

    async getJob() {
        let jobData = await this.transportLayer.receive();
        if (!jobData) return nullJob;
        return this.serializer.deserialize(jobData);
    }
}

module.exports = Queue;
