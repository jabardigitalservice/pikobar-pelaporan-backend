const filterLogQueue = (user, query) => {
  const { setDate } = require('../filter/date')
  const param = {}
  if (query.status) param.job_status = query.status
  if(query.date) param.createdAt = setDate('createdAt', query.date, query.date).createdAt
  param.author = user.id

  return param
}
module.exports = {
  filterLogQueue
}