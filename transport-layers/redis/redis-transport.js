class RedisTransport {
    constructor(channel) {
        this.channel = channel;
    }

    setNameChannel(nameChannel = '') {
        this.nameChannel = nameChannel;
        return this;
    }

    send(jobData) {
        return this.channel.sendMessage({
            qname  : this.nameChannel,
            message: jobData
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