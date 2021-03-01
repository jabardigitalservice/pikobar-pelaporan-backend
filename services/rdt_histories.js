const RdtHistory = require('../models/RdtHistory')

async function ListRdtHistory(callback) {
  try {
    const sort = { createdAt: 'desc' }
    const result = await RdtHistory.find().sort(sort)
    callback(null, result.map(q => q.toJSONFor()))
  } catch (error) {
    callback(error, null)
  }
}

async function getRdtHistoryById(id, callback) {
  try {
    const result = await RdtHistory.findById(id)
    callback(null, result.toJSONFor())
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.rdt_histories.list',
    method: ListRdtHistory
  },
  {
    name: 'services.rdt_histories.getById',
    method: getRdtHistoryById
  },
]

