const jsonPagination = (name, data) => {
  let jsonOutput = {
    [name]: data.result,
    _meta: {
      currentPage: 1,
      page: data.page,
      limitPerPage: data.limit,
      totalPages: Math.ceil(data.count / data.limit),
      countPerPage: data.result.length,
      countTotal: data.count
    }
  }
  return jsonOutput
}

module.exports = {
  jsonPagination
}