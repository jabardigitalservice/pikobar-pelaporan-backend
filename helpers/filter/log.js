const filterLogQueue = (user, query) => {
  const { setDate } = require('../filter/date')
  const params = {}
  if (query.status) param.job_status = query.status
  if(query.date) param.createdAt = setDate('createdAt', query.date, query.date).createdAt
  params.author = user.id

  return params
}
module.exports = {
  filterLogQueue
}