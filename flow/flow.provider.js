const Flow = require('./flow');

class FlowProvider {

    provide(job, queue) {
        let queueFlow = new Flow(queue);
        let config    = {...queue.options, ...job.flow};
        queueFlow.delay(config.delay);
        if (config.timeout) queueFlow.timeout(config.timeout);
        queueFlow.retry(config.retry);
        if (config.pushBack) queueFlow.pushBack(config.pushBack);

        return queueFlow;
    }
}

module.exports = FlowProvider;
