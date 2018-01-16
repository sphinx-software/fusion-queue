class NullTransport {

    setOptions(options = {}) {}

    setNameChannel(nameChannel = '') {
        return this;
    }

    async send(jobData) {}

    async receive() {}
}

module.exports = NullTransport;