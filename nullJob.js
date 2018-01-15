const Job = require('./job');

class NullJob extends Job {

    handle() {}
}

module.exports = NullJob;