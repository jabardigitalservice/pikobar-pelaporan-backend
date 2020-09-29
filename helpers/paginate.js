'use strict'
const optionsLabel = (query, sorts, populate) => {
  const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    meta: '_meta'
  };
  const options = {
    page: query.page,
    limit: query.limit,
    populate: populate,
    sort: sorts,
    leanWithId: true,
    customLabels: myCustomLabels
  };
  return options
};

module.exports = { optionsLabel }