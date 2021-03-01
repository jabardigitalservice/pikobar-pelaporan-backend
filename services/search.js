const Case = require('../models/Case')

const getCases = async (query, callback) => {
  const search = {}
  const params = { delete_status: { $ne: 'deleted' } }

  if(query.status) {
    params.status = query.status
  }

  if(query.address_district_code){
    params.address_district_code = query.address_district_code
  }

  if(query.keyword) {
    search.$or = [
      { name: new RegExp(`^${query.keyword}`, 'i') },
      { nik: new RegExp(query.keyword, 'i') },
      { id_case : new RegExp(query.keyword,'i') },
      { phone_number: new RegExp(query.keyword, 'i') },
    ]
  }

  const aggQuery = [
    { $match: { ...params, ...search } },
    {
      $project: {
        id_case: 1,
        status: 1,
        name: 1,
        label: { $concat: [
          { $ifNull: [ { $toString: "$id_case" }, ""] }, "/",
          { $ifNull: [ { $toString: "$name" }, ""] }, "/",
          { $ifNull: [ { $toString: "$nik" }, ""] }, "/",
          { $ifNull: [ { $toString: "$phone_number" }, ""] },
          ]
        },
        nik: 1,
        phone_number: 1,
        place_of_birth: 1,
        birth_date: 1,
        occupation: 1,
        gender: 1,
        address_street: 1,
        address_district_code: 1,
        address_district_name: 1,
        address_subdistrict_code: 1,
        address_subdistrict_name: 1,
        address_village_code: 1,
        address_village_name: 1,
        rt: 1,
        rw: 1,
        verified_status: 1,
      }
    }
  ]

  try {
    const result = await Case.aggregate(aggQuery).limit(10)

    callback (null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.search.getCases',
    method: getCases,
  }
]
