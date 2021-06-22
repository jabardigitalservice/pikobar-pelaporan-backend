const Queue = require('bee-queue')
const { sendEmailWithAttachment } = require('../email')
const { updateLogJob } = require('./log')
const options = {
  activateDelayedJobs: true,
  removeOnSuccess: true,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}

const emailOptions = (resultJob) => {
  const fs = require('fs')
  return [{
    filename: resultJob.filename,
    content: fs.createReadStream(resultJob.path),
    path: resultJob.path,
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }]
}

const createJobQueue = async (nameQueue, method, message, time) => {
  try {
    const jobQueue = new Queue(nameQueue, options)
    jobQueue.process(async (job, done) => {
      setTimeout(() => {
        console.log(`⏱️  Preparing : Queue name ${nameQueue} ${job.id}`)
      }, 1500)
      const timer = setInterval( async () => {
        await updateLogJob(job.id, { job_progress: 55 }) // notify job progress and save
        const resultJob = await method(job.data.query, job.data.user, job.id)
        console.log(`🧾 Success : Waiting for sending email`)

        await updateLogJob(job.id, { job_progress: 85 }) // notify job progress and save
        sendEmailWithAttachment(message, emailOptions(resultJob), job.data.query.email, resultJob.path, job.id, job.queue.name)
        done()
        clearInterval(timer)
      }, time * 60 * 1000)
    })
  } catch (error) {
    const param = {
      job_status: 'Error', job_progress: 85,
      type: 'job', message: error.toString()
    }
    await updateLogJob(job.id, param) // save job error
  }
}

module.exports = {
  createJobQueue
}