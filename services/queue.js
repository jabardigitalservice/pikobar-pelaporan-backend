const service = 'services.queue'
const { createQueue } = require('../helpers/queue')

const mapingResult = (result) => {
  const data = {}
  data.jobId = result.id
  data.progress = result.progress
  data.title = result.data
  data.timestamp = result.options.timestamp
  data.status = result.status

  return data
}

const sameCondition = async (queue, result, callback) => {
  try {
    const result = await queue
    const data = mapingResult(result)
    callback (null, data)
  } catch (error) {
    callback(error, null)
  }
}

const caseExport = async (query, user, callback) => {
  const nameQueue = 'export-queue-cases'
  const nameJob = 'queue-export-cases'

  await sameCondition(createQueue(nameQueue, nameJob), result, callback)
}

const historyExport = async (query, user, callback) => {
  const nameQueue = 'export-queue-histories'
  const nameJob = 'queue-export-histories'

  await sameCondition(createQueue(nameQueue, nameJob), result, callback)
}

module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
]