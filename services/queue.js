const service = 'services.queue'
const { createQueueCases, createQueueHistories } = require('../helpers/queue')

const mapingResult = (result) => {
  const data = {}
  data.jobId = result.id
  data.progress = result.progress
  data.title = result.data
  data.timestamp = result.options.timestamp
  data.status = result.status

  return data
}

const sameCondition = async (queue, callback) => {
  try {
    const result = await queue
    const data = mapingResult(result)
    callback (null, data)
  } catch (error) {
    callback(error, null)
  }
}

const caseExport = async (query, user, callback) => {
  await sameCondition(createQueueCases(), callback)
}

const historyExport = async (query, user, callback) => {
  await sameCondition(createQueueHistories(), callback)
}

module.exports = [
  { name: `${service}.queuCase`, method: caseExport },
  { name: `${service}.queuHistory`, method: historyExport },
]
