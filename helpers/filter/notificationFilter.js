const ObjectId = require('mongodb').ObjectID
const { setDate } = require('../filter/date')
const filterNotification = (query, userId) => {
  const params = {
    recipientId: ObjectId(userId)
  }

  if (query.isRead) {
    params.isRead = query.isRead
  }

  if (query.eventType) {
    params.eventType = query.eventType
  }

  if(query.startDate){
    param.createdAt = setDate('createdAt', query.startDate, query.startDate).createdAt
  }

  return params
}

const searchNotification = (query) => {
  const { search } = query

  if(!search) return {}

  const search_params = [
    {
      message: new RegExp(search, "i")
    },
  ]

  return search_params
}

module.exports = {
  filterNotification,
  searchNotification,
}
