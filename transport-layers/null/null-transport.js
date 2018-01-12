class AmqpTransport {
    constructor(channel) {
        this.channel = channel;
    }

    setOptions(options = {}) {}

    setNameChannel(nameChannel = '') {}

    async send(jobData) {}

    async receive() {}
}

module.exports = AmqpTransport;