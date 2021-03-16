
const service = 'services.queue'
const { createQueue } = require('../helpers/queue')
const { createJobQueue } = require('../helpers/job')
const { jobCaseExport, jobHistoryExport } = require('../helpers/job/export_xlsx')
const { QUEUE, JOB } = require('../helpers/constant')

const mapingResult = (result) => {
  const data = {}
  data.jobId = result.id
  data.progress = result.progress
  data.title = result.data
  data.timestamp = result.options.timestamp
  data.status = result.status

  return data
}

const sameCondition = async (query, user, queue, job, method, name, time, callback) => {
  try {
    const result = await createQueue(queue, job)
    const data = mapingResult(result)
    callback (null, data)

    const message = `Data${name}Kasus Pikobar Pelaporan : ${user.fullname}`
    createJobQueue(queue, query, user, method, message, time)
  } catch (error) {
    callback(error, null)
  }
}

const caseExport = async (query, user, callback) => {
  await sameCondition(
    query, user, QUEUE.CASE, JOB.CASE, jobCaseExport, ' ', 1, callback
  )
}

const historyExport = async (query, user, callback) => {
  await sameCondition(
    query, user, QUEUE.HISTORY, JOB.HISTORY, jobHistoryExport, ' Riwayat ', 1, callback
  )
}

module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
]