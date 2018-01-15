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

    async receive() {
        await this.channel.assertQueue(this.nameChannel);
        let msg = await this.channel.get(this.nameChannel, this.options.receive);
        return msg && msg.content.toString();
    }
}

module.exports = AmqpTransport;