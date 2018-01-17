const TransportLayer = require('../transport');

let store = {};

class MemoryTransport extends TransportLayer {

    setNameChannel(nameChannel = '') {
        this.nameChannel   = nameChannel;
        store[nameChannel] = store[nameChannel] || [];
        return this;
    }

    async send(jobData) {
        store[this.nameChannel].push(jobData);
        return this;
    }

    async receive() {
        return store[this.nameChannel].pop();
    }
}

module.exports = MemoryTransport;
