const VError        = require('verror');
const amqp          = require('amqplib');
const Promise       = require('bluebird');
const AmqpTransport = require('./amqp/amqp-transport');

class TransportFactory {

    /**
     *
     * @param transport
     * @param config
     * @return {Promise<QueueTransportLayer>}
     */
    make(transport, config) {
        switch (transport) {
            case 'amqp':
                return this.makeAmqpTransport(config);
            default :
                throw new VError(
                    `E_QUEUE: transport [${transport}] is not supported`);
        }
    };

    /**
     *
     * @param configQueue
     * @return {Promise<{QueueTransportLayer}>}
     */
    async makeFromConfig(configQueue) {
        return Promise.props(configQueue.use.reduce((queues, currentValue) => {
            let config           = configQueue.transports[currentValue];
            queues[currentValue] = this.make(config.adapter, config);
            return queues;
        }, {}));
    }

    /**
     *
     * @param config
     * @return {Promise<AmqpTransport>}
     */
    async makeAmqpTransport(config) {
        const connection = await amqp.connect(config.url);
        const channel    = await connection.createChannel();
        return new AmqpTransport(channel, config).setNameChannel(
            config.channelName).setOptions(config.options);
    }
}

module.exports = TransportFactory;