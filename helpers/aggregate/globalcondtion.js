const filterStatus = (query, criteria) => {
  let status
  if (query.criteria) {
    status = { $eq: ["$status", query.criteria] }
  } else {
    status = { $eq: ["$status", criteria.CONF] }
  }
  return status
}

const filterNotGrouping = (query, criteria) => {
  let status
  if (query.criteria) {
    status = { "status": query.criteria }
  } else {
    status = { "status": criteria.CONF }
  }
  return status
}

const matchWhere = (query, searching, where, criteria) => {
  const concats = {
    ...searching,
    ...where,
    ...filterNotGrouping(query, criteria)
  }
  return { $match: concats }
}

const dateGrouping = () => {
  const date1 = new Date();
  const date2 = new Date();
  const date3 = new Date();
  const date4 = new Date();
  const date5 = new Date();
  const date6 = new Date();
  const date7 = new Date();

  date1.setDate(date1.getDate() - 1);
  date2.setDate(date2.getDate() - 2);
  date3.setDate(date3.getDate() - 3);
  date4.setDate(date4.getDate() - 4);
  date5.setDate(date5.getDate() - 5);
  date6.setDate(date6.getDate() - 6);
  date7.setDate(date7.getDate() - 7);

  return {
    date_one: date1.toISOString().slice(0, 10),
    date_two: date2.toISOString().slice(0, 10),
    date_tree: date3.toISOString().slice(0, 10),
    date_four: date4.toISOString().slice(0, 10),
    date_fix: date5.toISOString().slice(0, 10),
    date_six: date5.toISOString().slice(0, 10),
    date_seven: date7.toISOString().slice(0, 10),
  }
}

module.exports = {
  filterStatus, filterNotGrouping, matchWhere, dateGrouping
}