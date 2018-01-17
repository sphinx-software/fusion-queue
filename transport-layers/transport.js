class TransportLayer {
    constructor() {
        this.configFlow = {};
    }

    setConfigFlow(configFlow) {
        this.configFlow = configFlow;
        return this;
    }

    getHandleOptions() {
        return this.configFlow;
    }
}

module.exports = TransportLayer;