const Queue = require('bee-queue')
const options = {
  isWorker: false,
  sendEvents: false,
  removeOnSuccess: true,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}

const createQueue = async (nameQueue, nameJob, batchId) => {
  const initialQueue = new Queue(nameQueue, options)
  return initialQueue.createJob(nameJob).setId(batchId).save()
}

const cancelQueue = async (nameQueue, jobId) => {
  const initialQueue = new Queue(nameQueue, options)
  try {
    return await initialQueue.removeJob(jobId)
  } catch (error) {
    return error
  }
}

module.exports = {
  createQueue, cancelQueue
}