const TransportFactory = require('./transport-layers/transport-factory');
const QueueSpinCommand = require('./queue-spin-command');
const QueueManager     = require('./queue/queue-manager');
const Queue            = require('./queue/queue');

exports.register = async (container) => {

    container.singleton('transportFactory', async () => new TransportFactory());
    container.singleton('queueManager', async () => {
        const configQueue = (await container.make('config')).queue;
        return new QueueManager().setDefault(configQueue.default);
    });

    container.singleton('transports', async () => {
        const configQueue      = (await container.make('config')).queue;
        const transportFactory = await container.make('transportFactory');
        return transportFactory.makeFromConfig(configQueue);
    });

    container.singleton('command.queue-spin', async () => {
        const queueManager = await container.make('queueManager');
        return new QueueSpinCommand(queueManager);
    });

};

exports.boot = async (container) => {
    const consoleKernel = await container.make('console.kernel');
    const transports    = await container.make('transports');
    const queueManager  = await container.make('queueManager');
    const serializer    = await container.make('serializer');

    for (const nameQueue in transports) {
        let queue = new Queue(transports[nameQueue], serializer);

        queueManager.register(nameQueue, queue);
    }

    await consoleKernel.register('command.queue-spin');
};