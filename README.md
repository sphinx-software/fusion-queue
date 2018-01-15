@sphinx-software/queue
===============

A queue for sphinx-fusion . support [`rabitmq`](https://www.rabbitmq.com/) using [amqp](https://github.com/squaremo/amqp.node)
## implements Job

Params

options {Object}: see more on options section
returns {GeneratorFunction}

```js
class Job {

    constructor(name) {
        this.name = name;
    }
    
    get flow() {
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

## Options queue
```js
module.exports = {
    default       : 'myQueue',
    queues: {
        myQueue : {
            url        : 'amqp://localhost',
            adapter    : 'amqp',
            channelName: 'someName',
            // For more options see http://www.squaremobius.net/amqp.node/channel_api.html#channel_consume
            options    : {
                receive: {
                    noAck: true
                }
            }
        },
        myQueue1: {
            url        : 'amqp://localhost',
            adapter    : 'amqp',
            channelName: 'someName1'
        },
        myQueue2: {
            url        : 'amqp://localhost',
            adapter    : 'amqp',
            channelName: 'someName2'
        }
    }
};
```
## Licences

[MIT](LICENSE)