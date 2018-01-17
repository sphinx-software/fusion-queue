const TransportFactory = require('./transport-layers/transport-factory');
const QueueSpinCommand = require('./queue-spin-command');
const QueueManager     = require('./queue/queue-manager');
const Queue            = require('./queue/queue');
const Worker           = require('./worker/worker');
const FlowProvider     = require('./flow/flow.provider');

exports.register = async (container) => {

    container.singleton('transportFactory', () => new TransportFactory());
    container.singleton('worker', async () => {
        const queueManager = await container.make('queueManager');
        return new Worker(queueManager, new FlowProvider());
    });
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
        const worker = await container.make('worker');
        return new QueueSpinCommand(worker);
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
