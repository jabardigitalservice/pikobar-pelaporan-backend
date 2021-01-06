const ObjectId = require('mongodb').ObjectID

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

  if(query.start_date){
    params.createdAt = {
      "$gte": new Date(new Date(query.start_date)).setHours(00, 00, 00),
      "$lt": new Date(new Date(query.start_date)).setHours(23, 59, 59)
    }
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
