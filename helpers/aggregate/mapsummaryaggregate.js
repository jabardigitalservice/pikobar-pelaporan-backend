const { search } = require('../filter/mapfilter')
const { groupingMap } = require("./mapgroup")
const { byRole } = require("./func/filter")
const { CRITERIA, ROLE } = require("../constant")

const summaryMap = async (user, query) => {
  const groups = byRole(ROLE, user)
  const searching = await search(user, query)
  return [
    {
      $match: {
        $and: [ searching ]
      }
    }, {
      $lookup:
      {
        from: 'districtgeos',
        localField: 'address_village_code',
        foreignField: 'kemendagri_desa_kode',
        as: 'geolocation'
      }
    }, { $unwind: '$geolocation' },
    groupingMap(groups, query, CRITERIA)
  ]
}

module.exports = {
  summaryMap
}