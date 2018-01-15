/**
 * @class
 * @implements {Middleware}
 */
class Delay {

    constructor(time) {
        this.time = time;
    }

    handle(job) {
        return () => new Promise((resolve) => {
            setTimeout(() => resolve(job()), this.time);
        });
    }

}

module.exports = Delay;