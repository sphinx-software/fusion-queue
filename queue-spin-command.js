/**
 * Queue Spin Command
 */
class QueueSpinCommand {

    constructor(queueProvider) {
        this.queuesProvider = queueProvider;
    }

    get name() {
        return 'queue-spin';
    }

    get arguments() {
        return '<queue-name>';
    }

    get description() {
        return 'Start Queue worker';
    }

    async action(queueName) {
        while (true) {
            await this.queuesProvider.exec(queueName).catch(error => error);
        }
    }
}

module.exports = QueueSpinCommand;