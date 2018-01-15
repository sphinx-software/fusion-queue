const QueueFolow = require('./queue-flow');

class QueueFolowFactory {

    makeFromConfig(config = {}, queue) {
        let queueFlow = new QueueFolow(queue);
        if (config.delay) queueFlow.delay(config.delay);
        if (config.timeout) queueFlow.timeout(config.timeout);
        if (config.retry) queueFlow.retry(config.retry);
        if (config.pushBack) queueFlow.pushBack(config.pushBack);
        return queueFlow;
    }
}

module.exports = QueueFolowFactory;