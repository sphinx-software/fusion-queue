const TransportLayer = require('../transport');

const jobStatus = {
    IDLE   : 'idle',
    WORKING: 'working',
    DONE   : 'done',
    FAILED : 'failed'
};

class DatabaseTransportLayer extends TransportLayer {
    constructor(databaseConnection) {
        super();
        this.databaseConnection = databaseConnection;
        this.delay              = 0;
    }

    setTable(nameTable = 'queues') {
        this.nameTable = nameTable;
        return this;
    }

    async boot() {
        await this.databaseConnection.schema.createTableIfNotExists(
            this.nameTable,
            function(table) {
                table.increments();
                table.text('jobData');
                table.string('status', 10);
                table.bigInteger('runAt');
            });

        return this;
    }

    setConfigFlow(flow) {
        let { delay, ...other } = flow;
        this.configFlow         = other;
        this.delayMilliSecond   = delay;
        return this;
    }

    getDelayTime(flow) {
        let delay = !isNaN(+flow.delay)
            ? flow.delay
            : this.params.delayMilliSecond;
        return new Date().getTime() + delay;
    }

    async send(jobData, flow) {
        const delay = this.getDelayTime(flow);
        return (await this.databaseConnection.insert({
            jobData,
            runAt : delay,
            status: jobStatus.IDLE
        }).into(this.nameTable).returning('id'))[0];
    }

    receive() {
        return this.databaseConnection.transaction(async (trx) => {
            let [response] = await trx.select('*').
                into(this.nameTable).
                orderBy('runAt', 'asc').
                having('runAt', '<', new Date().getTime()).
                where({ status: jobStatus.IDLE }).
                limit(1);
            if (!response) return null;
            await trx.from(this.nameTable).where({ id: response.id }).del();

            return response.jobData;
        });
    }

}

module.exports = DatabaseTransportLayer;
