const VError      = require('verror');
const amqp        = require('amqplib');
const RSMQPromise = require('rsmq-promise');
const Promise     = require('bluebird');

const AmqpTransport = require('./amqp/amqp-transport');
const RsmqTransport = require('./redis/redis-transport');

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
            case 'rsmq':
                return this.makeRedisTransport(config);
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
    makeFromConfig(configQueue) {
        return Promise.props(
            Object.keys(configQueue.queues).reduce((queues, currentValue) => {
                let config           = configQueue.queues[currentValue];
                queues[currentValue] = this.make(config.adapter, config);
                return queues;
            }, {})
        );
    }

    /**
     *
     * @param config
     * @return {Promise<AmqpTransport>}
     */
    async makeAmqpTransport(config) {
        const connection = await amqp.connect(config.url);
        const channel    = await connection.createChannel();
        return new AmqpTransport(channel, config).
            setNameChannel(config.channelName).
            setOptions(config.options);
    }

    async makeRedisTransport(config) {
        const rsmq       = new RSMQPromise(config);
        const listQueues = await rsmq.listQueues();
        if (listQueues.indexOf(config.channelName) === -1) {
            await rsmq.createQueue({qname: config.channelName});
        }
        return new RsmqTransport(rsmq).setNameChannel(config.channelName);
    }
}

module.exports = TransportFactory;