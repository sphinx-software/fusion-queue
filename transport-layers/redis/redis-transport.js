const TransportLayer = require('../transport');

class RedisTransport extends TransportLayer {
    constructor(channel) {
        super();
        this.channel = channel;
        this.options = {
            send: {}
        };
    }

    setNameChannel(nameChannel = '') {
        this.nameChannel = nameChannel;
        return this;
    }

    setConfigFlow(configFlow) {
        const { delay, ...other } = configFlow;
        this.configFlow           = other;
        this.options.send.delay   = delay;
        return this;
    }

    send(jobData, flow) {
        return this.channel.sendMessage({
            qname  : this.nameChannel,
            message: jobData,
            ...this.options.send,
            ...flow
        });
    }

    async receive() {
        let response = await this.channel.receiveMessage({
            qname: this.nameChannel
        });
        if (!response.id) return null;

        await this.channel.deleteMessage({
            qname: this.nameChannel,
            id   : response.id
        });

        return response.message;
    }
}

module.exports = RedisTransport;
