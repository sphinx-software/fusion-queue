const VError      = require('verror');
const RetryOnFail = require('./retryOnFail');
const Timeout     = require('./timeout');
const RotateBack  = require('./rotateback');

let instance;

class TaskBehaviorProvider {
    
    provide(name, config, queue) {
        switch (name) {
            case 'timeout':
                return this.makeTimeout(config);
            case 'retryOnFail':
                return this.makeRetryOnFail(config);
            case 'rotateBack':
                return this.makeRotateBack(queue);
            default :
                throw new VError(
                    `E_QUEUE_MIDDLEWARE: middleware [${name}] is not supported`);
        }
    }

    static shareInstance() {
        if (!instance) {
            instance = new TaskBehaviorProvider();
        }
        return instance;
    }

    makeTimeout(config) {
        let time = parseInt(config) || 0;
        return new Timeout(time);
    }

    makeRetryOnFail(config) {
        let number = parseInt(config) || 0;
        return new RetryOnFail(number);
    }

    makeRotateBack(queue) {
        return new RotateBack(queue);
    }
}

module.exports = TaskBehaviorProvider;