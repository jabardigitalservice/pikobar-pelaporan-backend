const { search } = require('../filter/mapfilter')
const aggregateCondition = async (user, query) => {
  const searching = await search(user, query)
  return [
    {
      $match: {
        $and: [searching]
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
    {
      "$project": {
        ...selectColumn
      }
    }
  ]
}

const selectColumn = {
  "_id": 1,
  "id": "$id_case",
  "kode_kab": "$address_district_code",
  "nama_kab": "$address_district_name",
  "kode_kec": "$address_subdistrict_code",
  "nama_kec": "$address_subdistrict_name",
  "kode_kel": "$address_village_code",
  "nama_kel": "$address_village_name",
  "status": "$status",
  "umur": "$age",
  "gender": "$gender",
  "final_result": "$final_result",
  "tanggal_konfirmasi": "$createdAt",
  "tanggal_update": "$updatedAt",
  "longitude": "$geolocation.latitude",
  "latitude": "$geolocation.longitude"
}

module.exports = {
  aggregateCondition
}