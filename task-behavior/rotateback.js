/**
 * @class
 * @implements {Middleware}
 */
class RotateBack {

    constructor(queue) {
        this.queue = queue;
    }

    async handle(job, next) {
        try {
            return await next;
        } catch (error) {
            return this.queue.enqueue(job);
        }
    }

}

module.exports = RotateBack;