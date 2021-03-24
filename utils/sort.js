const sortCondition = (query) => {
  const sort = { updatedAt: -1 };
  if (query.sort && query.sort.split) {
    const splits = query.sort.split(':')
    const sorted = splits[1] === 'desc' ? -1 : 1
    sort.last_date_status_patient = sorted
    sort[splits[0]] = sorted
  }

  return sort
}

module.exports = { sortCondition }