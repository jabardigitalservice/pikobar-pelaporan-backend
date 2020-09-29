const Exposure = require('../models/Case')
const ObjectId = require('mongodb').ObjectID

const createExposure = async (payload, id_case, callback) => {
  try {
    const inserted = await Exposure.updateOne(
      { "_id": ObjectId(id_case) },
      { $set: { 'close_contacted_before_sick_14_days': true },
        $addToSet: {
          'close_contact_premier': {
            "is_west_java": payload.is_west_java,
            "close_contact_id_case": payload.close_contact_id_case,
            "close_contact_criteria": payload.close_contact_criteria,
            "close_contact_name": payload.close_contact_name,
            "close_contact_nik": payload.close_contact_nik,
            "close_contact_phone_numbers": payload.close_contact_phone_numbers,
            "close_contact_birth_date": payload.close_contact_birth_date,
            "close_contact_occupation": payload.close_contact_occupation,
            "close_contact_gender": payload.close_contact_gender,
            "close_contact_address_street": payload.close_contact_address_street,
            "close_contact_address_district_code": payload.close_contact_address_district_code,
            "close_contact_address_district_name": payload.close_contact_address_district_name,
            "close_contact_address_subdistrict_code": payload.close_contact_address_subdistrict_code,
            "close_contact_address_subdistrict_name": payload.close_contact_nik,
            "close_contact_address_village_code": payload.close_contact_address_village_code,
            "close_contact_address_village_name": payload.close_contact_address_village_name,
            "close_contact_rt": payload.close_contact_rt,
            "close_contact_rw": payload.close_contact_rw,
            "close_contact_relation": payload.close_contact_relation,
            "close_contact_relation_others": payload.close_contact_relation_others,
            "close_contact_activity": payload.close_contact_activity,
            "close_contact_activity_others": payload.close_contact_activity_others,
            "close_contact_first_date": payload.close_contact_first_date,
            "close_contact_last_date": payload.close_contact_last_date,
          }
        }
      }, { new: true })
    callback(null, inserted)
  } catch (error) {
    callback(error, null)
  }
}

const listExposure = async (id_case, callback) => {
  try {
    const result = await Exposure.find({_id: id_case})
    .select(["close_contact_premier"])
    .sort({ updatedAt:-1 })
    callback(null, result)
  } catch (error) {
    callback(error, null)
  }
}

const updateExposure = async (id_exposure, payload, callback) => {
  try {
    const updated = await Exposure.updateOne(
      {
        "close_contact_premier._id": ObjectId(id_exposure)
      },
      { "$set": {
        "close_contact_premier.$.is_west_java": payload.is_west_java,
        "close_contact_premier.$.close_contact_id_case": payload.close_contact_id_case,
        "close_contact_premier.$.close_contact_criteria": payload.close_contact_criteria,
        "close_contact_premier.$.close_contact_name": payload.close_contact_name,
        "close_contact_premier.$.close_contact_nik": payload.close_contact_nik,
        "close_contact_premier.$.close_contact_phone_numbers": payload.close_contact_phone_numbers,
        "close_contact_premier.$.close_contact_birth_date": payload.close_contact_birth_date,
        "close_contact_premier.$.close_contact_occupation": payload.close_contact_occupation,
        "close_contact_premier.$.close_contact_gender": payload.close_contact_gender,
        "close_contact_premier.$.close_contact_address_street": payload.close_contact_address_street,
        "close_contact_premier.$.close_contact_address_district_code": payload.close_contact_address_district_code,
        "close_contact_premier.$.close_contact_address_district_name": payload.close_contact_address_district_name,
        "close_contact_premier.$.close_contact_address_subdistrict_code": payload.close_contact_address_subdistrict_code,
        "close_contact_premier.$.close_contact_address_subdistrict_name": payload.close_contact_nik,
        "close_contact_premier.$.close_contact_address_village_code": payload.close_contact_address_village_code,
        "close_contact_premier.$.close_contact_address_village_name": payload.close_contact_address_village_name,
        "close_contact_premier.$.close_contact_rt": payload.close_contact_rt,
        "close_contact_premier.$.close_contact_rw": payload.close_contact_rw,
        "close_contact_premier.$.close_contact_relation": payload.close_contact_relation,
        "close_contact_premier.$.close_contact_relation_others": payload.close_contact_relation_others,
        "close_contact_premier.$.close_contact_activity": payload.close_contact_activity,
        "close_contact_premier.$.close_contact_activity_others": payload.close_contact_activity_others,
        "close_contact_premier.$.close_contact_first_date": payload.close_contact_first_date,
        "close_contact_premier.$.close_contact_last_date": payload.close_contact_last_date,
      }}, { new : true })
    callback(null, updated)
  } catch (error) {
    callback(error, null)
  }
}

const deleteExposure = async (id_exposure, callback) => {
  try {
    const deleted  = await Exposure.updateOne(
    {
      "close_contact_premier._id": ObjectId(id_exposure)
    },
    { $pull: { close_contact_premier: { _id: ObjectId(id_exposure) } } })
    callback(null, deleted)
  } catch (error) {
    callback(error, null)
  }
}

module.exports = [
  {
    name: 'services.case_exposure.create',
    method: createExposure
  },{
    name: 'services.case_exposure.read',
    method: listExposure
  },{
    name: 'services.case_exposure.update',
    method: updateExposure
  },{
    name: 'services.case_exposure.delete',
    method: deleteExposure
  },
]

