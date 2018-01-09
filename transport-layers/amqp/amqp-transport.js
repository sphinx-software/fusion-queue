class AmqpTransport {
    constructor(channel) {
        this.channel = channel;
    }

    setOptions(options = {}) {
        this.options = {
            receive: options.receive || {},
            send   : options.send || {}
        };
        return this;
    }

    setNameChannel(nameChannel = '') {
        this.nameChannel = nameChannel;
        return this;
    }

    async send(jobData) {
        await this.channel.assertQueue(this.nameChannel);
        return this.channel.sendToQueue(
            this.nameChannel,
            new Buffer(jobData),
            this.options.send
        );
    }

    async receive(callback) {
        this.channel.consume(this.nameChannel, (message) => {
            callback(message.content);
        }, this.options.receive);
    }
}

module.exports = AmqpTransport;