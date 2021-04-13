## HOW TO USE

documentation of beequee [https://github.com/bee-queue/bee-queue](https://github.com/bee-queue/bee-queue)

### CODE QUALITY (CODE OF CONDUCT)
This custom function for globally package bee-queue redis

```javascript
/**
 *
 *
 * @param {*} nameQueue is string for naming queue
 * @param {*} nameJob is string for naming job
 * @return {*}
 */
const createQueue = async (nameQueue, nameJob) => {
  const initialQueue = new Queue(nameQueue, options)
  return initialQueue.createJob(nameJob).save()
}
```

require fuction globally
```javascript
const { createQueue } = require('helpers/queue')
```

example in your service

```javascript
const { createQueue } = require('helpers/queue')
const queuSomething = async () => {
  await createQueue('name-queue', 'name-job')
}
```
