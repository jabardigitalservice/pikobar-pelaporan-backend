const searchRegExp = new RegExp('/', 'g')

const setDate = (columnDate, minDate, maxDate) => {
  return {
    [columnDate]: {
      "$gte": new Date(new Date(minDate).setHours(00, 00, 00)),
      "$lt": new Date(new Date(maxDate).setHours(23, 59, 59))
    }
  }
}

const dateFilter = (query, columnDate) => {
  let dates = {}
  if (query.min_date && query.max_date) {
    let min = query.min_date
    let max = query.max_date
    let minDate = min.replace(searchRegExp, '-')
    let maxDate = max.replace(searchRegExp, '-')
    dates = setDate(columnDate, minDate, maxDate)
  }

  return dates
}

const oneDate = (query, columnDate) => {
  let dates = {}
  if (query.start_date) {
    let search = query.start_date
    let searchDate = search.replace(searchRegExp, '-')
    dates = setDate(columnDate, searchDate, searchDate)
  }

  return dates
}


module.exports = {
  setDate, dateFilter, oneDate
}