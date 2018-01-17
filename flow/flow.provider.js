const Flow = require('./flow');

class FlowProvider {

    provide(queue) {
        let queueFlow = new Flow(queue);
        let config    = queue.options;
        if (config.pushBack) queueFlow.pushBack(config.pushBack);
        if (config.timeout) queueFlow.timeout(config.timeout);

        return queueFlow.delay(config.delay).retry(config.retry);
    }
}

module.exports = FlowProvider;
