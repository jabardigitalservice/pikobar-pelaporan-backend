const Queue = require('bee-queue');

const options = {
  isWorker: false,
  sendEvents: false,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}

const exportQueueCases = new Queue('export-queue-cases', options);
const exportQueueHistories = new Queue('export-queue-histories', options);
const createQueueCases = async () => exportQueueCases.createJob('queue-export-cases').save()
const createQueueHistories = async () => exportQueueHistories.createJob('queue-export-histories').save()

module.exports = {
  createQueueCases, createQueueHistories
}