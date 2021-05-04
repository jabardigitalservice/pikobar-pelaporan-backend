const districtcities = {
  $lookup: {
    from: "districtcities",
    localField: "address_district_code",
    foreignField: "kemendagri_kabupaten_kode",
    as: "kota"
  }
}

const villages =   {
  $lookup: {
    from: 'villages',
    let: { code: '$current_location_village_code' },
    pipeline: [{ $match: { $expr: { $eq: ['$kemendagri_desa_kode', '$$code'] } } }],
    as: 'villages'
  }
}

module.exports = {
  districtcities, villages
}