/**
 * @class
 * @implements {Middleware}
 */
class RetryOnFail {

    constructor(number) {
        this.number = number;
    }

    handler(job, next) {
        return this.tryAgain(job, next, this.number);
    }

    async tryAgain(job, next, number) {
        if (number === 0) {
            return next;
        }

        try {
            await next;
        } catch (error) {
            return this.tryAgain(job, job.handler(), number - 1);
        }
    }
}

module.exports = RetryOnFail;