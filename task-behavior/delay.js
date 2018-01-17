/**
 * @class
 * @implements {Middleware}
 */
class Delay {

    constructor(time = 0) {
        this.time = time;
    }

    handle(job, next) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(job.handle()), this.time);
        });
    }

}

module.exports = Delay;
