const TransportLayer = require('../transport');

class NullTransport extends TransportLayer {

    setOptions(options = {}) {}

    setNameChannel(nameChannel = '') {
        return this;
    }

    async send(jobData) {}

    async receive() {}
}

module.exports = NullTransport;
