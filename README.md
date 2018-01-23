@sphinx-software/queue
===============

## A queue for sphinx-fusion 
 - support [`rabitmq`](https://www.rabbitmq.com/) using [amqp](https://github.com/squaremo/amqp.node)
 - support [`sqs`](https://aws.amazon.com/sqs/) using [aws-sdk](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html)
 - support [`redis-queue`](https://redis.io/) using [rsmq](https://github.com/smrchy/rsmq)
 - support `database-queue` using [knex](http://knexjs.org/) for Postgres, MSSQL, MySQL, MariaDB, SQLite3, and Oracle 
 - support `null-queue`,`memory-queue`
## implements Job

```js
class Job {

    constructor(name) {
        this.name = name;
    }
    
    get flow() {
        // overwrite option flow default (no required)
        return {
            delay:1000,
            timeout:15000,
            retry:3,
            pushBack:true,
        }
    }

    handle() {
        // run task 
        console.log(`hello ${this.name}`);
    }
}
```
## Provider Register

```js
let serializer = await container.make('serializer');
serializer.forType(Job,
    (job) => job.name,
    (jobData) => new Job(jobData.name)
)
```

## Controller

```js
contructor(queueManager) {
    this.queueManager = queueManager;
}
static get dependencies() {
    return ['queueManager'];
}

use() {
    this.queueManager.to('myQueue').enqueue(new Job('word'));
}
```

## Config options queue
```js
queue {
    default: 'databaseQueue',
    queues : {
        rabbitMQ     : {
            url        : 'amqp://localhost',
            adapter    : 'amqp',
            channelName: 'someName',
            // flow default for queue if flow for job is not available            
            flow       : 'timeout:15000|delay:0|retry:3|rotateBack',
            // For more options see http://www.squaremobius.net/amqp.node/channel_api.html#channel_get
            options    : {
                send   : {
                    noAck: true
                },
                receive: {
                    noAck: true
                }
            }
        },
        redisMQ      : {
            host       : '127.0.0.1',
            flow       : 'timeout:15000|delay:900000|retry:3|pushBack',
            port       : 6379,
            adapter    : 'rsmq',
            channelName: 'someName2'
        },
        SQS          : {
            flow           : 'timeout:15000|delay:30000|retry:3|rotateBack',
            adapter        : 'sqs',
            queueUrl       : 'queueURL',
            accessKeyId    : 'accessKeyId',
            secretAccessKey: 'secretAccessKey',
            region         : 'us-east-1'
        },
        databaseQueue: {
            flow   : 'timeout:15000|delay:30000|retry:3|rotateBack',
            adapter: 'database'
        }
    }
};

```
## Licences

[MIT](LICENSE)