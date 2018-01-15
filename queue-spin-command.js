/**
 * Queue Spin Command
 */
class QueueSpinCommand {

    constructor(queueManager) {
        this.queueManager = queueManager;
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
            await this.queueManager.to(queueName).
                exec().
                catch(error => {
                    console.log(error);
                });
        }
    }
}

module.exports = QueueSpinCommand;