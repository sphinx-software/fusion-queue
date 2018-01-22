class TransportLayer {
    constructor() {
        this.configFlow = {};
    }

    /**
     *
     * @param {{delay: number, retry: number, timeout: number, rotateBack: boolean}} configFlow
     */
    setConfigFlow(configFlow) {
        this.configFlow = configFlow;
        return this;
    }

    /**
     *
     * @return {{delay: number, retry: number, timeout: number, rotateBack: boolean}}
     */
    getHandleOptions() {
        return this.configFlow;
    }

    /**
     *
     * @param {String} jobData
     * @param {Object} flow
     * @return {Promise<*>}
     */
    send(jobData, flow) {
        throw new Error('not implemented');
        return null;
    }

    /**
     * return {String|null} jobData;
     */
    receive() {
        throw new Error('not implemented');
    }
}

module.exports = TransportLayer;