const TransportLayer = require('../transport');
const { promisify }  = require('util');

class SqsTransport extends TransportLayer {

    constructor(sqs) {
        super();
        this.sqs                = sqs;
        this.sqs.receiveMessage = promisify(sqs.receiveMessage);
        this.sqs.deleteMessage  = promisify(sqs.deleteMessage);
        this.sqs.sendMessage    = promisify(sqs.sendMessage);
        this.params             = {
            MessageAttributes: {}
        };
    }

    setConfigFlow(flow) {
        let { delay, ...other } = flow;
        this.configFlow         = other;
        this.params.delay       = (delay / 1000) || null;
        return this;
    }

    setQueueUrl(queueUrl = '') {
        this.params.QueueUrl = queueUrl;
        return this;
    }

    setMessageAttributes(messageAttributes) {
        this.params.MessageAttributes = messageAttributes;
        return this;
    }

    getDelaySeconds(flow) {
        let delay = flow.delay / 1000;
        if (!isNaN(delay)) return delay;
        return this.params.delay;
    }

    send(jobData, flow = {}) {
        return this.sqs.sendMessage({
            QueueUrl    : this.params.QueueUrl,
            MessageBody : jobData,
            DelaySeconds: this.getDelaySeconds(flow)
        });
    }

    async receive() {
        let response = await this.sqs.receiveMessage({
            QueueUrl: this.params.QueueUrl
        });
        if (!response.Messages) return null;
        await this.delete({
            QueueUrl     : this.params.QueueUrl,
            ReceiptHandle: response.Messages[0].ReceiptHandle
        });
        return response.Messages[0].Body;
    }

    delete(params) {
        return this.sqs.deleteMessage(params);
    }

}

module.exports = SqsTransport;
