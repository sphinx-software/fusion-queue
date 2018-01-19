const VError      = require('verror');
const amqp        = require('amqplib');
const AWS         = require('aws-sdk');
const RSMQPromise = require('rsmq-promise');
const Promise     = require('bluebird');
const {promisify} = require('util');

const AmqpTransport   = require('./amqp/amqp-transport');
const RsmqTransport   = require('./redis/redis-transport');
const MemoryTransport = require('./memory/memory-transport');
const NullTransport   = require('./null/null-transport');
const SQSTransport    = require('./sqs/sqsTransport');

class TransportFactory {

    /**
     *
     * @param transport
     * @param config
     * @return {Promise<TransportLayer>}
     */
    make(transport, config) {
        config.flow = this.buildConfigFlowFromString(config.flow);
        switch (transport) {
            case 'amqp':
                return this.makeAmqpTransport(config);
            case 'rsmq':
                return this.makeRedisTransport(config);
            case 'nullmq':
                return this.makeNullTransport(config);
            case 'memorymq':
                return this.makeMemoryTransport(config);
            case 'sqs':
                return this.makeSQSTransport(config);
            default :
                throw new VError(
                    `E_QUEUE: transport [${transport}] is not supported`);
        }
    };

    /**
     *
     * @param {string} configFlow
     * @return {Object}
     */
    buildConfigFlowFromString(configFlow = '') {
        return configFlow.split('|').reduce((previous, current) => {
            let [name, value = true] = current.split(':');
            previous[name]   = value;
            return previous;
        }, {});
    }

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
            setOptions(config.options).
            setConfigFlow(config.flow);
    }

    async makeRedisTransport(config) {
        const rsmq                     = new RSMQPromise(config);
        const listQueues               = await rsmq.listQueues();
        let {delay = 0, ...configFlow} = config.flow;
        delay /= 1000;
        if (!listQueues.includes(config.channelName)) {
            await rsmq.createQueue({
                qname: config.channelName,
                delay: delay
            });
        } else {
            await rsmq.setQueueAttributes({
                qname: config.channelName,
                delay
            });
        }
        return new RsmqTransport(rsmq).
            setNameChannel(config.channelName).
            setConfigFlow(configFlow);
    }

    makeMemoryTransport(config) {
        return new MemoryTransport().
            setNameChannel(config.channelName).
            setConfigFlow(config.flow);
    }

    makeNullTransport(config) {
        return new NullTransport().
            setNameChannel(config.channelName).
            setConfigFlow(config.flow);
    }

    async makeSQSTransport(config) {
        const {flow, accessKeyId, secretAccessKey, region, queueUrl} = config;
        return new SQSTransport(
            new AWS.SQS({accessKeyId, secretAccessKey, region})).
            setQueueUrl(queueUrl).
            setConfigFlow(flow);
    }
}

module.exports = TransportFactory;
