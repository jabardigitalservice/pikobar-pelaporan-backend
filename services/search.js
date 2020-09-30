const Case = require('../models/Case')

const getCases = async (query, callback) => {
  let search = {}
  const params = {
    delete_status: { $ne: 'deleted' }
  }

  if(query.status){
    params.status = query.status
  }

  if(query.address_district_code){
    params.address_district_code = query.address_district_code
  }

  if(query.keyword) {
    search = [
      { id_case : new RegExp(query.keyword,'i') },
      { name: new RegExp(query.keyword, 'i') },
      { nik: new RegExp(query.keyword, 'i') },
      { phone_number: new RegExp(query.keyword, 'i') },
    ]
  }

  const select = [
    'id_case',
    'status',
    'name',
    'nik',
    'phone_number',
    'place_of_birth',
    'birth_date',
    'occupation',
    'gender',
    'address_street',
    'address_district_code',
    'address_district_name',
    'address_subdistrict_code',
    'address_subdistrict_name',
    'address_village_code',
    'address_village_name',
    'rt',
    'rw',
    'verified_status',
  ]

  try {
    const result = await Case
      .find(params)
      .or(search)
      .select(select)
      .limit(10)

    callback (null, result)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.search.getCases',
    method: getCases
  }
]
