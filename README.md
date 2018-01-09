@sphinx-software/queue
===============

A queue for sphinx-fusion . support [`rabitmq`](https://www.rabbitmq.com/) using [amqp](https://github.com/squaremo/amqp.node)
## Job
```js
class Job {

    constructor(name) {
        this.name = name;
    }

    handle() {
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
contructor(queueProvider) {
    this.queueProvider = queueProvider;
}
static get dependencies() {
    return ['queueProvider'];
}

use() {
    this.queueProvider.provide('myQueue').enqueue(new Job('word'));
}
```

## Options queue
```js
module.exports = {
    use       : ['myQueue', 'myQueue1'],
    transports: {
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