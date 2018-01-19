/**
 * Queue Spin Command
 */
class QueueSpinCommand {

    constructor(worker) {
        this.worker = worker;
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
            await this.worker.runJob(queueName).
                catch(error => {
                    console.log(error);
                });
        }
    }
}

module.exports = QueueSpinCommand;