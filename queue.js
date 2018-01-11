class Queue {
    constructor(transportLayer, serializer) {
        this.transportLayer = transportLayer;
        this.serializer     = serializer;
        this.middlewares    = [];
    }

    /**
     *
     * @param {Middleware} middleware
     */
    addMiddlewale(middleware) {
        this.middlewares.push(middleware);
    }

    /**
     *
     * @param {Job} job
     * @return {Promise<void>}
     */
    enqueue(job) {
        let serializedJob = this.serializer.serialize(job);
        return this.transportLayer.send(serializedJob);
    }

    async compose() {
        let job = await this.getJob();
        return this.middlewares.reduce((previousValue, currentValue) => {
            return currentValue.handler(job, previousValue);
        }, job.handler());
    }

    async getJob() {
        let jobData = await this.transportLayer.receive();
        if (!jobData) return {handler: () => {}};
        return this.serializer.deserialize(jobData);
    }
}

module.exports = Queue;
