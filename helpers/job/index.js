const Queue = require('bee-queue')
const fs = require('fs')
const { sendEmailWithAttachment } = require('../email')
const options = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
}

const createJobQueue = (nameQueue, query, user, reply, method, message, time) => {
  const jobQueue = new Queue(nameQueue, options)
  jobQueue.process(async (job, done) => {
    setTimeout(() => {
      console.log(`⏱️  Preparing : Queue name ${nameQueue} ${job.id}`)
      job.reportProgress(10)
    }, 1500)

    const resultJob = await method(query, user, reply)
    const timer = setInterval(() => {
      clearInterval(timer)
      console.log(`🧾 Success : Queue name ${nameQueue} ${job.id} ready sending to user : ${user.fullname}`)
      job.reportProgress(100)
      done()

      // notify job and attempt to send the mail
      const options = [{
        filename: resultJob.filename,
        content: fs.createReadStream(resultJob.path),
        path: resultJob.path,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }]

      sendEmailWithAttachment(message, options, user, resultJob.path)
    }, time * 60 * 1000)
  })
}

module.exports = {
  createJobQueue
}