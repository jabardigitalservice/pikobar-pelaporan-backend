const jsonPagination = (name, data) => {
  const size = (data.result.length < data.limit ? data.limit : data.count)
  let jsonOutput = {
    [name]: data.result,
    _meta: {
      currentPage: 1,
      page: data.page,
      limitPerPage: data.limit,
      totalPages:  Math.ceil(size / data.limit),
      countPerPage: data.result.length,
      countTotal: data.count
    }
  }
  return jsonOutput
}

module.exports = {
  jsonPagination
}