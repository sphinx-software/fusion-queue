/**
 * @class
 * @implements {Middleware}
 */
class Log {

    handler(job) {
        return job;
    }

}

module.exports = Log;