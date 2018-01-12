/**
 * @class
 * @implements {Middleware}
 */
class Timeout {

    constructor(timeout) {
        this.timer = () => new Promise((resolve, reject) => {
            setTimeout(() => reject('time out'), timeout);
        });
    }

    handler(job, next) {
        return Promise.race([next, this.timer()]);
    }

}

module.exports = Timeout;