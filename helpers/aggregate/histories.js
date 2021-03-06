const { villages } = require('./func/lookup')

const conditionHistories = (id_case) => {
  return [
    { $match: { case: id_case, delete_status: { $ne: 'deleted' } } },
    { ...villages },
    {
      $addFields: {
        village: {
          $cond: [{ $eq: [{ '$size': `$villages` }, 0] }, { $literal: {} }, { $arrayElemAt: ['$villages', 0] }]
        }
      }
    },
    {
      $project: {
        status: 1, final_result: 1, last_date_status_patient: 1, first_symptom_date: 1, diagnosis: 1, diseases: 1,
        current_location_district: { '$ifNull': ['$village.kemendagri_desa_nama', ''] },
        current_location_subdistrict: { '$ifNull': ['$village.kemendagri_kecamatan_nama', ''] },
        current_location_village: { '$ifNull': ['$village.kemendagri_desa_nama', ''] },
        current_location_type: 1, current_location_address: 1, createdAt: 1,
      }
    },
  ]
}

module.exports = {
  conditionHistories
}