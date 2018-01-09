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
    async enqueue(job) {
        let serializedJob = this.serializer.serialize(job);
        return this.transportLayer.send(serializedJob);
    }

    async spin() {
        return new Promise((resolve) => {
            this.transportLayer.receive((jobData) => {
                let job = this.serializer.deserialize(jobData.toString());
                // todo
                job.handle();
                resolve();
            });
        });
    }
}

module.exports = Queue;
