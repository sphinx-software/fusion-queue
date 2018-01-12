const TransportFactory            = require('./transport-layers/transport-factory');
const QueueSpinCommand            = require('./queue-spin-command');
const QueueProvider               = require('./queue/queue.provider');
const Queue                       = require('./queue/queue');
const TransportMiddlewareProvider = require('./task-behavior/taskBehavior.provider');

exports.register = async (container) => {

    container.singleton('transportFactory', async () => new TransportFactory());
    container.singleton('queueProvider', async () => new QueueProvider());

    container.singleton('transports', async () => {
        const configQueue      = (await container.make('config')).queue;
        const transportFactory = await container.make('transportFactory');
        return transportFactory.makeFromConfig(configQueue);
    });

    container.singleton('command.queue-spin', async () => {
        const queueProvider = await container.make('queueProvider');
        return new QueueSpinCommand(queueProvider);
    });

};

exports.boot = async (container) => {
    const queueMiddlewareProvider = new TransportMiddlewareProvider();
    const consoleKernel           = await container.make('console.kernel');
    const transports              = await container.make('transports');
    const queueProvider           = await container.make('queueProvider');
    const serializer              = await container.make('serializer');
    const config                  = await container.make('config');

    for (const nameQueue in transports) {
        let queue = new Queue(transports[nameQueue], serializer);

        let configTransportMiddlewares = config.queue.transports[nameQueue].middlewares || [];
        configTransportMiddlewares.map(stringConfig => {

            let middleware = queueMiddlewareProvider.provideFromConfig(stringConfig, queue);

            queue.addMiddlewale(middleware);

        });

        queueProvider.register(nameQueue, queussse);
    }

    await consoleKernel.register('command.queue-spin');
};