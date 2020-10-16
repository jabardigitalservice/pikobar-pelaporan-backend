// requirement func to generate id case to support multiple insertion cases
const getCountBasedOnDistrict = async (services, districtCode) => {
  const pre = {
    count_case: {},
    count_case_pending: {},
    case_count_outside_west_java: {},
  }

  await services.cases.getCountByDistrict(
    districtCode,
    (err, res) => {
      if (err) return
      pre.count_case = res
    })

  await services.cases.getCountPendingByDistrict(
    districtCode,
    (err, res) => {
      if (err) return
      pre.count_case_pending = res
    })

  await services.v2.cases.getCaseCountsOutsideWestJava(
    districtCode,
    (err, res) => {
      if (err) return
      pre.case_count_outside_west_java = res
    })

  return pre
}

module.exports = {
  getCountBasedOnDistrict,
}
