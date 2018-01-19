const TransportLayer = require('../transport');
const {promisify}    = require('util');

class SqsTransport extends TransportLayer {

    constructor(sqs) {
        super();
        this.sqs                = sqs;
        this.sqs.receiveMessage = promisify(sqs.receiveMessage);
        this.sqs.deleteMessage  = promisify(sqs.deleteMessage);
        this.sqs.sendMessage    = promisify(sqs.sendMessage);
        this.params = {
          MessageAttributes : {}
        }
    }

    setConfigFlow(flow) {
      let { delay , ...other } = flow;
      this.configFlow          = other;
      this.params.DelaySeconds = (flow.delay / 1000) || 0;
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

    send(jobData) {
        return this.sqs.sendMessage({
            MessageBody : jobData,
            ...this.params
        });
    }

    receive() {
        return this.sqs.receiveMessage({
          QueueUrl: this.params.QueueUrl
        });
    }

    delete(params) {
        return this.sqs.deleteMessage(params);
    }

}

module.exports = SqsTransport;
