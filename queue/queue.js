const NullJob = require('../nullJob');
const Job     = require('../job');
const nullJob = new NullJob();

class Queue {
    constructor(transportLayer, serializer) {
        if (!transportLayer) throw new Error('transportLayer not found');
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
        return this.transportLayer.send(serializedJob, job.flow);
    }

    get options() {
        return this.transportLayer.getHandleOptions();
    }

    /**
     *
     * @return {Promise<Job>}
     */
    async onJob() {
        let jobData = await this.transportLayer.receive();
        if (!jobData) return nullJob;
        return this.serializer.deserialize(jobData);
    }
}

module.exports = Queue;
